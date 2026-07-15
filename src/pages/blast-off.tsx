import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { encodePacked, formatUnits, parseUnits } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi';
import { GameMode } from '@/components/game-calculator/mode-selector';
import { GameInfo, GameRatings, GameSection } from '@/components/game-layout';
import BlastOffCalculator from '@/components/games/blast-off/blast-off-calculator';
import BlastOffGame from '@/components/games/blast-off/blast-off-game';
import { WinDialog } from '@/components/ui/win-dialog';
import {
  MIN_TARGET_COEFFICIENT,
  blastOffInfoConfig,
} from '@/constants/blast-off';
import { getContractAddresses } from '@/constants/contracts';
import { useGameRatings } from '@/hooks/useGameRatings';
import { useLocalVrfAutoFulfill } from '@/hooks/useLocalVrfAutoFulfill';
import { usePendingRoundRatings } from '@/hooks/usePendingRoundRatings';
import { usePlayGame } from '@/hooks/usePlayGame';
import { useTokensBalances } from '@/hooks/useTokensBalances';
import { useUserGameEvent } from '@/hooks/useUserGameEvent';
import { delay } from '@/lib/delay';

interface IBlastOffBet {
  requestId: string;
  winMultiplier: string;
  loseMultiplier: string;
  amountPaid: bigint;
}

export const BlastOffPage = () => {
  const chainId = useChainId();
  const { blastOff: blastOffAddress } = getContractAddresses(chainId);
  const { refreshBalances } = useTokensBalances();
  const { ratings, ratingsLoading, trigger } = useGameRatings('blastOff');
  const { visibleRatings, markRoundPending, revealNextRow, clearPendingRound } =
    usePendingRoundRatings(ratings);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [mode, setMode] = useState<GameMode>(GameMode.Manual);
  const [betAmount, setBetAmount] = useState('0');
  const [numOfBets, setNumOfBets] = useState(1);
  const [gameIsRunning, setGameIsRunning] = useState(false);
  const [winAmount, setWinAmount] = useState('0');

  const [targetCoeff, setTargetCoeff] = useState(
    MIN_TARGET_COEFFICIENT.toFixed(1),
  );
  const [currentCoeff, setCurrentCoeff] = useState(0.96);
  const coeffRef = useRef(targetCoeff);
  const betRef = useRef(betAmount);

  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [isLose, setIsLose] = useState(false);

  const [recentTotalBet, setRecentTotalBet] = useState('0');

  const { startGame, checkAllowance, finalBetWithFee } = usePlayGame(
    blastOffAddress,
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
    address: blastOffAddress,
    functionName: 'getMaxBetCount',
  });

  const roundNumOfBets = useMemo(
    () => BigInt(mode === GameMode.Auto ? numOfBets : 1),
    [mode, numOfBets],
  );

  useLocalVrfAutoFulfill({
    gameAddress: blastOffAddress,
    mockRandomMax: 593749n,
    numOfBets: roundNumOfBets,
  });

  const gameData = useMemo(
    () =>
      encodePacked(
        ['uint256', 'uint256'],
        [
          roundNumOfBets,
          BigInt((parseFloat(targetCoeff) * 10000 || 0).toFixed(0)),
        ],
      ),
    [roundNumOfBets, targetCoeff],
  );

  const handleGame = useCallback(
    async (blastOffGamesResults: IBlastOffBet[]) => {
      gamesCount.current = 0;
      setButtonDisabled(true);
      while (gamesCount.current < blastOffGamesResults.length) {
        if (shouldStartGame.current) {
          setGameIsRunning(true);
          setIsWin(false);
          setIsLose(false);
          changeStartGame(false);
          let winTriggered: boolean = false;

          const { loseMultiplier, amountPaid, winMultiplier } =
            blastOffGamesResults[gamesCount.current];

          const startTime = Date.now();
          await new Promise((resolve) => {
            const createTransitionInterval = setInterval(async () => {
              const time_elapsed = (Date.now() - startTime) / 1000.0;

              const multiplier = 1.016 * Math.pow(1.03, time_elapsed);

              setCurrentCoeff(multiplier);

              if (parseFloat(winMultiplier) <= multiplier) {
                if (!winTriggered) {
                  setIsWin(true);
                  winTriggered = true;
                  const winAmount = formatUnits(amountPaid, 18);

                  if (amountPaid > 0) setWinAmount(winAmount);
                  await refreshBalances();

                  setTimeout(() => {
                    setDialogOpen(true);
                  }, 0.7 * 1000);
                }
              }

              if (parseFloat(loseMultiplier) <= multiplier) {
                clearInterval(createTransitionInterval);
                setGameIsRunning(false);
                setIsLose(true);
                setCurrentCoeff(parseFloat(loseMultiplier));

                if (!winTriggered) {
                  setWinAmount('0');
                  changeStartGame(true);
                }
                revealNextRow();

                setTimeout(() => {
                  setIsLose(false);
                  setIsWin(false);
                  setCurrentCoeff(0.96);
                }, 4 * 1000);
                gamesCount.current = gamesCount.current + 1;
                await new Promise(() => setTimeout(resolve, 5 * 1000));
              }
              trigger();
            }, 10);
          });
        }
        await delay(2000);
      }
      setButtonDisabled(false);
      clearPendingRound();
    },
    [
      changeStartGame,
      clearPendingRound,
      revealNextRow,
      trigger,
      refreshBalances,
    ],
  );

  useUserGameEvent({
    gameAddress: blastOffAddress,
    eventName: 'GameEnd',
    onLogs: (logs) => {
      markRoundPending(String(logs[0].args.requestId), logs.length);

      handleGame(
        logs.map(({ args }) => ({
          requestId: String(args.requestId),
          winMultiplier: coeffRef.current,
          amountPaid: args.amountPaid,
          loseMultiplier: formatUnits(args.randomNumber, 22),
        })),
      );
      setRecentTotalBet(betRef.current);
    },
  });

  const handleBet = async () => {
    setButtonDisabled(true);
    setIsLose(false);
    setIsWin(false);

    try {
      await checkAllowance(finalBetWithFee * roundNumOfBets);
      await startGame(betAmount, gameData);
    } catch {
      setButtonDisabled(false);
      return setGameIsRunning(false);
    }
  };

  useEffect(() => {
    coeffRef.current = targetCoeff;
    betRef.current = betAmount;
  }, [betAmount, targetCoeff]);

  return (
    <div className="grid grid-cols-1 gap-10 p-3 lg:p-6">
      <GameSection>
        <BlastOffCalculator
          mode={mode}
          setMode={setMode}
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          numOfBets={numOfBets}
          setNumOfBets={setNumOfBets}
          targetCoeff={targetCoeff}
          setTargetCoeff={setTargetCoeff}
          recentWin={+winAmount}
          onBet={handleBet}
          gameIsRunning={isButtonDisabled}
          setGameIsRunning={setButtonDisabled}
          gameData={gameData}
          maxBetCount={Number(maxBetCount || 100)}
        />
        <BlastOffGame
          gameIsRunning={gameIsRunning}
          isLose={isLose}
          isWin={isWin}
          setIsLose={setIsLose}
          currentRate={currentCoeff}
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
      <GameInfo config={blastOffInfoConfig} />
    </div>
  );
};
