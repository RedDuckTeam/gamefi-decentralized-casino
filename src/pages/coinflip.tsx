import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { encodePacked, formatUnits, parseUnits } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi';
import { flipEndAudio } from '@/api/sound.ts';
import { GameMode } from '@/components/game-calculator/mode-selector';
import { GameInfo, GameRatings, GameSection } from '@/components/game-layout';
import CoinflipCalculator from '@/components/games/coinflip/coinflip-calculator';
import CoinflipGame from '@/components/games/coinflip/coinflip-game';
import { WinDialog } from '@/components/ui/win-dialog';
import {
  CoinflipVariant,
  coinflipInfoConfig,
  getCoinflipLoseState,
} from '@/constants/coinflip';
import { getContractAddresses } from '@/constants/contracts';
import { useGameRatings } from '@/hooks/useGameRatings';
import { useLocalVrfAutoFulfill } from '@/hooks/useLocalVrfAutoFulfill';
import { usePendingRoundRatings } from '@/hooks/usePendingRoundRatings';
import { usePlayGame } from '@/hooks/usePlayGame';
import { useRecentWinsStore } from '@/hooks/useRecentWinsState';
import { useTokensBalances } from '@/hooks/useTokensBalances';
import { useUserGameEvent } from '@/hooks/useUserGameEvent';
import { delay } from '@/lib/delay';

type CoinflipRoundData = {
  requestId: string;
  randomNum: number;
  result: boolean;
  amountPaid: bigint;
};

export type CoinflipGameState = 'lose' | 'win' | 'none';
export type CoinflipHistory = {
  state: CoinflipGameState;
  variant: CoinflipVariant;
};
export const CoinflipPage = () => {
  const chainId = useChainId();
  const { coinflip: coinflipAddress } = getContractAddresses(chainId);
  const { refreshBalances } = useTokensBalances();
  const { ratings, ratingsLoading, trigger } = useGameRatings('coinFlip');
  const { visibleRatings, markRoundPending, revealNextRow, clearPendingRound } =
    usePendingRoundRatings(ratings);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [betAmount, setBetAmount] = useState('0');
  const [winAmount, setWinAmount] = useState('0');

  const [mode, setMode] = useState<GameMode>(GameMode.Manual);
  const [numOfBets, setNumOfBets] = useState(1);
  const [gameIsRunning, setGameIsRunning] = useState(false);
  const [selectedSide, setSelectedSide] = useState(CoinflipVariant.HEADS);
  const [recentResult, setRecentResult] = useState<CoinflipGameState>('none');
  const [recentTotalBet, setRecentTotalBet] = useState('0');

  const betRef = useRef(betAmount);
  const sideRef = useRef(selectedSide);

  const [oppositeSide, setOppositeSide] = useState<CoinflipVariant | null>(
    null,
  );
  const [oppositeSideCopy, setOppositeSideCopy] =
    useState<CoinflipVariant | null>(null);
  const [betId, setBetId] = useState<number>(0);

  const { coinFlipRecentWins, getCoinFlipRecentWins, setCoinFlipRecentWins } =
    useRecentWinsStore();

  const [isWin, setIsWin] = useState(false);
  const [isLose, setIsLose] = useState(false);

  const { startGame, checkAllowance, finalBetWithFee } = usePlayGame(
    coinflipAddress,
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
    address: coinflipAddress,
    functionName: 'getMaxBetCount',
  });

  const roundNumOfBets = useMemo(
    () => BigInt(mode === GameMode.Auto ? numOfBets : 1),
    [mode, numOfBets],
  );

  useLocalVrfAutoFulfill({
    gameAddress: coinflipAddress,
    mockRandomMax: 49n,
    numOfBets: roundNumOfBets,
  });

  const gameData = useMemo(
    () =>
      encodePacked(
        ['uint256', 'uint256'],
        [
          roundNumOfBets,
          BigInt(selectedSide === CoinflipVariant.HEADS ? 1 : 2),
        ],
      ),
    [roundNumOfBets, selectedSide],
  );

  useEffect(() => {
    setRecentResult('none');
  }, [selectedSide]);

  const handleGame = useCallback(
    async (selectedSide: CoinflipVariant, rounds: CoinflipRoundData[]) => {
      gamesCount.current = 0;
      while (gamesCount.current < rounds.length) {
        if (shouldStartGame.current) {
          const round = rounds[gamesCount.current];
          setDialogOpen(false);
          setOppositeSideCopy(null);
          setRecentResult('none');
          setBetId((prev) => prev + 1);
          changeStartGame(false);

          await new Promise((resolve) => {
            let recentResult: CoinflipGameState;
            let oppositeSideTemp: CoinflipVariant;

            if (round.amountPaid === 0n) {
              recentResult = 'lose';
              setOppositeSide(getCoinflipLoseState(selectedSide)!);
              oppositeSideTemp = getCoinflipLoseState(selectedSide)!;
              changeStartGame(true);
              setTimeout(async () => {
                setOppositeSideCopy(getCoinflipLoseState(selectedSide)!);
              }, 3.2 * 1000);
            } else {
              recentResult = 'win';
              setOppositeSide(selectedSide);
              oppositeSideTemp = selectedSide;
              setTimeout(async () => {
                setDialogOpen(true);
                setOppositeSideCopy(selectedSide);
              }, 3.2 * 1000);
            }

            setTimeout(async () => {
              flipEndAudio.play();
              setWinAmount(
                round.amountPaid > 0 ? formatUnits(round.amountPaid, 18) : '0',
              );

              setRecentResult(recentResult);

              const prevWins = getCoinFlipRecentWins();

              let newWins: CoinflipHistory[] = [
                ...prevWins,
                { state: recentResult, variant: oppositeSideTemp },
              ];

              if (newWins.length > 4) {
                newWins = newWins.slice(1);
              }

              setCoinFlipRecentWins(newWins);
              revealNextRow();

              gamesCount.current = gamesCount.current + 1;
              await new Promise(() => setTimeout(resolve, 2500));
            }, 3.2 * 1000);
          });
        }
        await refreshBalances();
        await trigger();
        await delay(2000);
      }

      setGameIsRunning(false);
      clearPendingRound();
    },
    [
      changeStartGame,
      clearPendingRound,
      getCoinFlipRecentWins,
      revealNextRow,
      trigger,
      refreshBalances,
      setCoinFlipRecentWins,
    ],
  );

  useUserGameEvent({
    gameAddress: coinflipAddress,
    eventName: 'GameEnd',
    onLogs: (logs) => {
      markRoundPending(String(logs[0].args.requestId), logs.length);

      handleGame(
        sideRef.current,
        logs.map(({ args }) => ({
          requestId: String(args.requestId),
          amountPaid: args.amountPaid,
          result: args.result,
          randomNum: +formatUnits(args.randomNumber, 4),
        })),
      );
      setRecentTotalBet(betRef.current);
    },
  });

  const handleBet = useCallback(async () => {
    setGameIsRunning(true);
    setIsWin(false);
    setIsLose(false);
    setRecentResult('none');
    setOppositeSide(null);
    setOppositeSideCopy(null);

    try {
      await checkAllowance(finalBetWithFee * roundNumOfBets);
      await startGame(betAmount, gameData);
    } catch {
      return setGameIsRunning(false);
    }
  }, [
    betAmount,
    checkAllowance,
    finalBetWithFee,
    gameData,
    roundNumOfBets,
    startGame,
  ]);

  useEffect(() => {
    betRef.current = betAmount;
    sideRef.current = selectedSide;
  }, [betAmount, selectedSide]);

  return (
    <div className="grid grid-cols-1 gap-10 p-3 lg:p-6">
      <GameSection>
        <CoinflipCalculator
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
          selectedSide={selectedSide}
          setSelectedSide={setSelectedSide}
          setOppositeSide={setOppositeSide}
          setOppositeSideCopy={setOppositeSideCopy}
          gameData={gameData}
          maxBetCount={Number(maxBetCount || 100)}
        />
        <CoinflipGame
          isLose={isLose}
          isWin={isWin}
          betId={betId}
          oppositeSide={oppositeSide}
          oppositeSideCopy={oppositeSideCopy}
          gameIsRunning={gameIsRunning}
          recentWins={coinFlipRecentWins}
          selectedSide={selectedSide}
          recentResult={recentResult}
          // previousBets={previousBets}
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
      <GameInfo config={coinflipInfoConfig} />
    </div>
  );
};
