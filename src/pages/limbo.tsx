import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { encodePacked, formatUnits, parseUnits } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi';
import { GameMode } from '@/components/game-calculator/mode-selector';
import { GameInfo, GameRatings, GameSection } from '@/components/game-layout';
import LimboCalculator from '@/components/games/limbo/limbo-calculator';
import LimboGame from '@/components/games/limbo/limbo-game';
import { WinDialog } from '@/components/ui/win-dialog';
import { getContractAddresses } from '@/constants/contracts';
import { MIN_TARGET_COEFFICIENT, limboInfoConfig } from '@/constants/limbo';
import { useGameRatings } from '@/hooks/useGameRatings';
import { useLocalVrfAutoFulfill } from '@/hooks/useLocalVrfAutoFulfill';
import { usePendingRoundRatings } from '@/hooks/usePendingRoundRatings';
import { usePlayGame } from '@/hooks/usePlayGame';
import { useRecentWinsStore } from '@/hooks/useRecentWinsState.ts';
import { useTokensBalances } from '@/hooks/useTokensBalances';
import { useUserGameEvent } from '@/hooks/useUserGameEvent';
import { delay } from '@/lib/delay';

export interface ILimboPreviousBet {
  result: boolean;
  multiplier: string;
}

interface ILimboBet {
  winMultiplier: string;
  loseMultiplier: string;
  requestId: string;
  amountPaid: bigint;
}

export const LimboPage = () => {
  const chainId = useChainId();
  const { limbo: limboAddress } = getContractAddresses(chainId);
  const { refreshBalances } = useTokensBalances();
  const { ratings, ratingsLoading, trigger } = useGameRatings('limbo');
  const { visibleRatings, markRoundPending, revealNextRow, clearPendingRound } =
    usePendingRoundRatings(ratings);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [numOfBets, setNumOfBets] = useState(1);
  const [winAmount, setWinAmount] = useState('0');
  const { limboRecentWins, getLimboRecentWins, setLimboRecentWins } =
    useRecentWinsStore();
  const [betAmount, setBetAmount] = useState('0');
  const betRef = useRef(betAmount);

  const [gameIsRunning, setGameIsRunning] = useState(false);

  const [mode, setMode] = useState<GameMode>(GameMode.Manual);
  const [targetCoeff, setTargetCoeff] = useState(
    MIN_TARGET_COEFFICIENT.toFixed(1),
  );
  const targetRef = useRef(targetCoeff);
  const [liveMultiplier, setLiveMultiplier] = useState('0.96');
  const [isWin, setIsWin] = useState(false);
  const [isLose, setIsLose] = useState(false);
  const [recentTotalBet, setRecentTotalBet] = useState('0');

  const { startGame, checkAllowance, finalBetWithFee } = usePlayGame(
    limboAddress,
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
    address: limboAddress,
    functionName: 'getMaxBetCount',
  });

  const roundNumOfBets = useMemo(
    () => BigInt(mode === GameMode.Auto ? numOfBets : 1),
    [mode, numOfBets],
  );

  useLocalVrfAutoFulfill({
    gameAddress: limboAddress,
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
    async (limboGamesResults: ILimboBet[]) => {
      gamesCount.current = 0;
      while (gamesCount.current < limboGamesResults.length) {
        if (shouldStartGame.current) {
          setGameIsRunning(true);
          setIsWin(false);
          setIsLose(false);
          changeStartGame(false);

          const { loseMultiplier, winMultiplier, amountPaid } =
            limboGamesResults[gamesCount.current];
          setLiveMultiplier('0.96');
          const startTime = Date.now();
          await new Promise((resolve) => {
            const gameCounter = setInterval(async () => {
              const time_elapsed = (Date.now() - startTime) / 1000.0;
              const multiplier = (
                1.0024 * Math.pow(1.0718, time_elapsed)
              ).toFixed(2);
              setLiveMultiplier(multiplier);

              if (parseFloat(winMultiplier) <= parseFloat(multiplier)) {
                setDialogOpen(false);
                clearInterval(gameCounter);
                const winAmount = formatUnits(amountPaid, 18);

                if (amountPaid > 0) setWinAmount(winAmount);

                setIsWin(true);
                setLiveMultiplier(multiplier);

                setTimeout(() => {
                  const prevWins = getLimboRecentWins();

                  let newWins: ILimboPreviousBet[] = [
                    ...prevWins,
                    {
                      multiplier: Number(winMultiplier).toFixed(2),
                      result: true,
                    },
                  ];

                  if (newWins.length > 4) {
                    newWins = newWins.slice(1);
                  }

                  setLimboRecentWins(newWins);
                  setDialogOpen(true);
                }, 0.7 * 1000);

                gamesCount.current = gamesCount.current + 1;

                await new Promise(() => setTimeout(resolve, 5 * 1000));
              }

              if (parseFloat(loseMultiplier) <= parseFloat(multiplier)) {
                setDialogOpen(false);

                setIsLose(true);
                setLiveMultiplier(multiplier);
                clearInterval(gameCounter);

                setTimeout(() => {
                  const prevWins = getLimboRecentWins();
                  let newWins: ILimboPreviousBet[] = [
                    ...prevWins,
                    {
                      multiplier: Number(loseMultiplier).toFixed(2),
                      result: false,
                    },
                  ];

                  if (newWins.length > 4) {
                    newWins = newWins.slice(1);
                  }

                  setLimboRecentWins(newWins);
                  changeStartGame(true);
                }, 0.7 * 1000);

                gamesCount.current = gamesCount.current + 1;
                revealNextRow();
                await new Promise(() => setTimeout(resolve, 5 * 1000));
              }
            }, 1);
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
      getLimboRecentWins,
      revealNextRow,
      trigger,
      refreshBalances,
      setLimboRecentWins,
    ],
  );

  useUserGameEvent({
    gameAddress: limboAddress,
    eventName: 'GameEnd',
    onLogs: (logs) => {
      markRoundPending(String(logs[0].args.requestId), logs.length);

      handleGame(
        logs.map(({ args }) => ({
          requestId: String(args.requestId),
          winMultiplier: targetRef.current,
          amountPaid: args.amountPaid,
          loseMultiplier: formatUnits(args.randomNumber, 22),
        })),
      );
      setRecentTotalBet(betRef.current);
    },
  });

  const handleBet = async () => {
    setGameIsRunning(true);
    setIsLose(false);
    setIsWin(false);
    setLiveMultiplier('0.96');

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
    targetRef.current = targetCoeff;
  }, [betAmount, targetCoeff]);

  return (
    <>
      <div className="grid grid-cols-1 gap-10 p-3 lg:p-6">
        <GameSection>
          <LimboCalculator
            mode={mode}
            setMode={setMode}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            numOfBets={numOfBets}
            setNumOfBets={setNumOfBets}
            recentWin={parseFloat(String(visibleRatings?.[0]?.payout || 0))}
            onBet={handleBet}
            gameIsRunning={gameIsRunning}
            setGameIsRunning={setGameIsRunning}
            targetCoeff={targetCoeff}
            gameData={gameData}
            maxBetCount={Number(maxBetCount || 100)}
          />
          <LimboGame
            isLose={isLose}
            isWin={isWin}
            liveMultiplier={liveMultiplier}
            setTargetCoeff={setTargetCoeff}
            targetCoeff={targetCoeff}
            previousBets={limboRecentWins}
            gameIsRunning={gameIsRunning}
          />
        </GameSection>
        <GameRatings ratings={visibleRatings} ratingsLoading={ratingsLoading} />
        <GameInfo config={limboInfoConfig} />
      </div>

      <WinDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        amount={parseFloat(winAmount)}
        bet={parseFloat(recentTotalBet)}
        onClose={modalClose}
      />
    </>
  );
};
