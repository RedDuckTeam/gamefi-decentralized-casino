import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { encodePacked, formatUnits, parseUnits } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi';
import { diceAudio } from '@/api/sound.ts';
import { GameMode } from '@/components/game-calculator/mode-selector';
import { GameInfo, GameRatings, GameSection } from '@/components/game-layout';
import { DiceCalculator, DiceGame } from '@/components/games/dice';
import { WinDialog } from '@/components/ui/win-dialog';
import { getContractAddresses } from '@/constants/contracts';
import { SliderVariant, diceInfoConfig } from '@/constants/dice';
import { useGameRatings } from '@/hooks/useGameRatings';
import { useLocalVrfAutoFulfill } from '@/hooks/useLocalVrfAutoFulfill';
import { usePendingRoundRatings } from '@/hooks/usePendingRoundRatings';
import { usePlayGame } from '@/hooks/usePlayGame';
import { useRecentWinsStore } from '@/hooks/useRecentWinsState.ts';
import { useTokensBalances } from '@/hooks/useTokensBalances';
import { useUserGameEvent } from '@/hooks/useUserGameEvent';
import { delay } from '@/lib/delay';
import { formatNumberWithLeadingZeros } from '@/lib/utils';

export interface DiceGameResult {
  requestId: string;
  result: boolean;
  amountPaid: string;
  randomNum: number;
}

export const DicePage = () => {
  const chainId = useChainId();
  const { dice: diceAddress } = getContractAddresses(chainId);
  const { refreshBalances } = useTokensBalances();
  const { ratings, ratingsLoading, trigger } = useGameRatings('dice');
  const { visibleRatings, markRoundPending, revealNextRow, clearPendingRound } =
    usePendingRoundRatings(ratings);

  const [betAmount, setBetAmount] = useState('0');
  const betRef = useRef(betAmount);
  const [winAmount, setWinAmount] = useState('0');
  const [dialogOpen, setDialogOpen] = useState(false);

  const [mode, setMode] = useState<GameMode>(GameMode.Manual);
  const [numOfBets, setNumOfBets] = useState(1);
  const [gameIsRunning, setGameIsRunning] = useState(false);

  const { diceRecentWins, getDiceRecentWins, setDiceRecentWins } =
    useRecentWinsStore();
  const [recentTotalBet, setRecentTotalBet] = useState('0');

  const [selectedValue, setSelectedValue] = useState(50);
  const [rand, setRand] = useState([0, 0, 0, 0]);
  const [roll, setRoll] = useState(SliderVariant.OVER);

  const [isWin, setIsWin] = useState(false);
  const [isLose, setIsLose] = useState(false);

  const { startGame, checkAllowance, finalBetWithFee } = usePlayGame(
    diceAddress,
    parseUnits(betAmount, 18),
  );

  const modalClose = useCallback(() => {
    shouldStartGame.current = true;
  }, []);

  const changeStartGame = useCallback((value: boolean) => {
    shouldStartGame.current = value;
  }, []);
  const shouldStartGame = useRef(true);
  const gamesCount = useRef(0);

  const { data: maxBetCount } = useReadContract({
    abi: gameAbi,
    address: diceAddress,
    functionName: 'getMaxBetCount',
  });

  const roundNumOfBets = useMemo(
    () => BigInt(mode === GameMode.Auto ? numOfBets : 1),
    [mode, numOfBets],
  );

  useLocalVrfAutoFulfill({
    gameAddress: diceAddress,
    mockRandomMax: 9998n,
    numOfBets: roundNumOfBets,
  });

  const gameData = useMemo(
    () =>
      encodePacked(
        ['uint256', 'uint256', 'uint256'],
        [
          roundNumOfBets,
          BigInt(Math.round(selectedValue * 100)),
          BigInt(roll === SliderVariant.UNDER ? 0 : 1),
        ],
      ),
    [roll, roundNumOfBets, selectedValue],
  );

  const handleGame = useCallback(
    async (diceGameResults: DiceGameResult[]) => {
      gamesCount.current = 0;
      while (gamesCount.current < diceGameResults.length) {
        if (shouldStartGame.current) {
          const { requestId, randomNum, result, amountPaid } =
            diceGameResults[gamesCount.current];
          setDialogOpen(false);
          changeStartGame(false);

          const num = formatNumberWithLeadingZeros(randomNum);
          setRand([+num[0], +num[1], +num[2], +num[3]]);
          diceAudio.play();
          if (result) {
            setIsWin(true);

            const winAmount = formatUnits(BigInt(amountPaid), 18);

            if (+amountPaid > 0) setWinAmount(winAmount);

            setTimeout(() => {
              setGameIsRunning(false);

              setDialogOpen(true);
            }, 0.7 * 1000);
          } else {
            setIsLose(true);
            setGameIsRunning(false);
            changeStartGame(true);
          }

          setTimeout(() => {
            setIsLose(false);
            setIsWin(false);
          }, 2 * 1000);
          gamesCount.current = gamesCount.current + 1;
          await delay(3000);

          const prevWins = getDiceRecentWins();
          let newWins: DiceGameResult[] = [
            ...prevWins,
            { requestId, randomNum, result, amountPaid },
          ];

          if (newWins.length > 4) {
            newWins = newWins.slice(1);
          }

          setDiceRecentWins(newWins);
          revealNextRow();
        }
        await refreshBalances();
        await trigger();
        await delay(2000);
      }
      clearPendingRound();
    },
    [
      changeStartGame,
      clearPendingRound,
      getDiceRecentWins,
      revealNextRow,
      trigger,
      refreshBalances,
      setDiceRecentWins,
    ],
  );

  useUserGameEvent({
    gameAddress: diceAddress,
    eventName: 'GameEnd',
    onLogs: (logs) => {
      markRoundPending(String(logs[0].args.requestId), logs.length);

      handleGame(
        logs.map(({ args }) => ({
          requestId: String(args.requestId),
          amountPaid: String(args.amountPaid),
          result: args.result ?? false,
          randomNum: +formatUnits(args.randomNumber ?? 0n, 4),
        })),
      );
      setRecentTotalBet(betRef.current);
    },
  });

  const handleBet = async () => {
    setGameIsRunning(true);
    setIsWin(false);
    setIsLose(false);

    try {
      await checkAllowance(finalBetWithFee * roundNumOfBets);
      await startGame(betAmount, gameData);
      setRecentTotalBet(betAmount);
    } catch {
      return setGameIsRunning(false);
    }
  };

  useEffect(() => {
    betRef.current = betAmount;
  }, [betAmount]);

  return (
    <div className="grid grid-cols-1 gap-10 p-3 lg:p-6">
      <GameSection>
        <DiceCalculator
          mode={mode}
          setMode={setMode}
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          numOfBets={numOfBets}
          setNumOfBets={setNumOfBets}
          recentWin={+winAmount}
          onBet={handleBet}
          gameIsRunning={gameIsRunning}
          setGameIsRunning={setGameIsRunning}
          gameData={gameData}
          maxBetCount={Number(maxBetCount || 100)}
        />
        <DiceGame
          rand={rand}
          isLose={isLose}
          isWin={isWin}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
          roll={roll}
          setRoll={setRoll}
          previousBets={diceRecentWins}
        />
      </GameSection>
      <WinDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        amount={+winAmount}
        bet={+recentTotalBet}
        onClose={modalClose}
      />
      <GameRatings ratings={visibleRatings} ratingsLoading={ratingsLoading} />
      <GameInfo config={diceInfoConfig} />
    </div>
  );
};
