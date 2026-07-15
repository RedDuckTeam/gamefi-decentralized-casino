import {
  type MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { encodeAbiParameters, formatUnits, parseUnits } from 'viem';
import { useChainId, useReadContract, useReadContracts } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi';
import { plinkoAbi } from '@/abi/plinkoAbi.ts';
import { GameMode } from '@/components/game-calculator/mode-selector.tsx';
import { RiskLevel } from '@/components/game-calculator/risk-selector.tsx';
import { allowRows } from '@/components/games/plinko/constants.ts';
import { usePlinkoStore } from '@/components/games/plinko/hooks/usePlinkoStore.ts';
import { getContractAddresses } from '@/constants/contracts.ts';
import { useGameRatings } from '@/hooks/useGameRatings';
import { useLocalVrfAutoFulfill } from '@/hooks/useLocalVrfAutoFulfill';
import { usePlayGame } from '@/hooks/usePlayGame';
import { useTokensBalances } from '@/hooks/useTokensBalances';
import { type GameEventLogs, useUserGameEvent } from '@/hooks/useUserGameEvent';
import { delay } from '@/lib/delay';

const ROWS_TO_ID = {
  8: 0,
  10: 1,
  12: 2,
  14: 3,
  16: 4,
};

export const usePlinkoCalculator = ({
  setWinAmount,
  setDialogOpen,
  setRecentTotalBet,
  shouldStartGame,
  changeStartGame,
}: {
  setWinAmount: (winAmount: string) => void;
  setDialogOpen: (open: boolean) => void;
  setRecentTotalBet: (amount: string) => void;
  shouldStartGame: MutableRefObject<boolean>;
  changeStartGame: (value: boolean) => void;
}) => {
  const chainId = useChainId();
  const { plinko: plinkoAddress } = getContractAddresses(chainId);

  // UI State
  const [gameIsRunning, setGameIsRunning] = useState(false);
  const [mode, setMode] = useState<GameMode>(GameMode.Manual);
  const [risk, setRisk] = useState<RiskLevel>(RiskLevel.Middle);
  const [numOfBets, setNumOfBets] = useState(1);
  const [betAmount, setBetAmount] = useState('0');
  const betAmountRef = useRef(betAmount);

  // Global State
  const rows = usePlinkoStore((state) => state.rows);

  // Global Actions
  const setRows = usePlinkoStore((state) => state.setRows);
  const setSpawnBall = usePlinkoStore((state) => state.setSpawnBall);
  const setPayouts = usePlinkoStore((state) => state.setPayouts);

  // Local State
  const [gameEndLog, setGameEndLog] = useState<GameEventLogs<'GameEnd'>>([]);

  // Logic
  const { startGame, checkAllowance, finalBetWithFee } = usePlayGame(
    plinkoAddress,
    parseUnits(betAmount, 18),
  );
  const { trigger } = useGameRatings('plinko');

  const { data: maxBetCount } = useReadContract({
    abi: gameAbi,
    address: plinkoAddress,
    functionName: 'getMaxBetCount',
  });

  const { refreshBalances } = useTokensBalances();

  const roundNumOfBets = useMemo(
    () => BigInt(mode === GameMode.Auto ? numOfBets : 1),
    [mode, numOfBets],
  );

  useLocalVrfAutoFulfill({
    gameAddress: plinkoAddress,
    mockRandomMax: 1n,
    numOfBets: roundNumOfBets,
  });

  // Add payouts to global state
  const { data: payouts } = useReadContract({
    abi: plinkoAbi,
    address: plinkoAddress,
    functionName: 'getPayouts',
    args: [risk, allowRows.indexOf(rows)],
  });

  const { data: ranges } = useReadContracts({
    contracts: [...Array(rows)].map((_, index) => ({
      abi: plinkoAbi,
      address: plinkoAddress,
      functionName: 'ranges',
      args: [ROWS_TO_ID[rows], index],
    })),
  });

  const gamesCount = useRef(0);

  const gameData = useMemo(
    () =>
      encodeAbiParameters(
        [
          { name: 'numberOfGames', type: 'uint256' },
          { name: 'rows', type: 'uint256' },
          { name: 'risk', type: 'uint256' },
        ],
        [roundNumOfBets, BigInt(allowRows.indexOf(rows)), BigInt(risk)],
      ),
    [risk, roundNumOfBets, rows],
  );

  useEffect(() => {
    if (payouts) {
      setPayouts(payouts as bigint[]);
    }
  }, [payouts, setPayouts]);

  const handleGameEnd = useCallback(
    async (log: GameEventLogs<'GameEnd'>) => {
      gamesCount.current = 0;
      while (gamesCount.current < log.length) {
        if (shouldStartGame.current) {
          const logItem = log[gamesCount.current];
          if (ranges?.length) {
            for (let g = 0; g < ranges.length; g++) {
              if (g === 0) {
                if (ranges[g].result === logItem.args.randomNumber) {
                  setSpawnBall(g);
                  break;
                }
              }

              if (g === ranges.length - 1) {
                if (ranges[g].result === logItem.args.randomNumber) {
                  setSpawnBall(g);
                  break;
                }
              }

              if (
                BigInt(ranges[g].result as bigint) >
                BigInt(logItem.args.randomNumber)
              ) {
                setSpawnBall(g);
                break;
              }
            }
          }

          changeStartGame(false);
          if (logItem.args.result) {
            setTimeout(() => {
              setWinAmount(formatUnits(logItem.args.amountPaid, 18));
              setDialogOpen(true);
            }, 5000);
          }

          gamesCount.current = gamesCount.current + 1;
          await delay(2000);
          await refreshBalances();
          await trigger();
        }
        await delay(2000);
      }
      setGameIsRunning(false);
    },
    [
      changeStartGame,
      gamesCount,
      ranges,
      trigger,
      refreshBalances,
      setDialogOpen,
      setSpawnBall,
      setWinAmount,
      shouldStartGame,
    ],
  );

  useEffect(() => {
    handleGameEnd(gameEndLog);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameEndLog]);

  useUserGameEvent({
    gameAddress: plinkoAddress,
    eventName: 'GameEnd',
    onLogs: setGameEndLog,
  });

  const handleBet = async () => {
    setGameIsRunning(true);
    setRecentTotalBet(betAmount);
    betAmountRef.current = betAmount;

    try {
      await checkAllowance(finalBetWithFee * roundNumOfBets);
      await startGame(betAmount, gameData);
    } catch {
      setGameIsRunning(false);
    }
  };

  return {
    rows,
    setRows,
    setSpawnBall,
    mode,
    setMode,
    risk,
    setRisk,
    numOfBets,
    setNumOfBets,
    betAmount,
    setBetAmount,
    handleBet,
    gameData,
    gameIsRunning,
    maxBetCount,
    setGameIsRunning,
  };
};
