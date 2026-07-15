import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { encodeAbiParameters, formatUnits, parseUnits } from 'viem';
import {
  useAccount,
  useChainId,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from 'wagmi';

import { gameAbi } from '@/abi/gameAbi';
import { slotsAbi } from '@/abi/slotsAbi';
import { slotsAudio } from '@/api/sound.ts';
import { GameMode } from '@/components/game-calculator/mode-selector';
import { GameInfo, GameSection } from '@/components/game-layout';
import SlotsGameRatings from '@/components/game-layout/game-rating/slots-ratings';
import SlotsCalculator from '@/components/games/slots/slots-calculator';
import SlotsGame from '@/components/games/slots/slots-game';
import { WinDialog } from '@/components/ui/win-dialog';
import { getContractAddresses } from '@/constants/contracts';
import { slotsInfoConfig } from '@/constants/slots';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useLocalVrfAutoFulfill } from '@/hooks/useLocalVrfAutoFulfill';
import { usePlayGame } from '@/hooks/usePlayGame';
import { useSlotsClaims } from '@/hooks/useSlotsClaims';
import { useTokensBalances } from '@/hooks/useTokensBalances';
import { useUserGameEvent } from '@/hooks/useUserGameEvent';
import { delay } from '@/lib/delay';
import { findSlot } from '@/lib/slots/findSlot';
import { generateSlotsMatrix } from '@/lib/slots/generateSlotsMatrix';
import { getInitialSlots } from '@/lib/slots/getInitialSlots';

export type SlotsRoundData = {
  betId: string;
  winner: string;
  result: boolean;
  amountPaid: string;
  userBet: string;
};

export const SlotsPage = () => {
  const chainId = useChainId();
  const { slots: slotsAddress } = getContractAddresses(chainId);
  const { refreshBalances } = useTokensBalances();
  const { claimsData, claimsLoading, trigger } = useSlotsClaims();
  const { address } = useAccount();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<GameMode>(GameMode.Manual);
  const [numOfBets, setNumOfBets] = useState(1);
  const [betAmount, setBetAmount] = useState('0');

  const recentTotalBetRef = useRef(0);
  const modeRef = useRef<GameMode>(mode);
  const slotsDataRef = useRef<SlotsRoundData[] | null>(null);

  const [recentResult, setRecentResult] = useState<boolean | null>(null);

  const [recentWin, setRecentWin] = useState(0);

  const [slotsState, setSlotsState] = useState<number[][]>(getInitialSlots());
  const [gameIsRunning, setGameIsRunning] = useState(false);
  const [roundIsRunning, setRoundIsRunning] = useState(false);

  const [lastRoundId, setLastRoundId] = useState<string | null>(null);
  const [hiddenHistoryRows, setHiddenHistoryRows] = useState<number>(0);
  const [savedHiddenHistoryRows, setSavedHiddenHistoryRows] =
    useLocalStorage<number>('savedHiddenHistoryRows', 0);

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { startGame, checkAllowance, finalBetWithFee } = usePlayGame(
    slotsAddress,
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
    address: slotsAddress,
    functionName: 'getMaxBetCount',
  });

  useLocalVrfAutoFulfill({
    gameAddress: slotsAddress,
    mockRandomMax: 1n,
    numOfBets: BigInt(numOfBets),
  });

  const [slotsData, setSlotsData] = useLocalStorage<SlotsRoundData[]>(
    `slots`,
    [],
  );

  const showRatings = useMemo(() => {
    if (!claimsData) return null;

    const filteredRatings = [...claimsData];

    for (let i = 0; i < hiddenHistoryRows; i++) {
      if (!lastRoundId) break;
      const index = filteredRatings.findIndex(
        (x) => x.requestId === lastRoundId,
      );

      if (index !== -1) {
        filteredRatings.splice(index, 1);
      }
    }

    for (let i = 0; i < savedHiddenHistoryRows; i++) {
      const savedLastRoundId = slotsData[0]?.betId;
      if (!savedLastRoundId) break;

      const index = filteredRatings.findIndex(
        (x) => x.requestId === savedLastRoundId,
      );

      if (index !== -1) {
        filteredRatings.splice(index, 1);
      }
    }

    return filteredRatings;
  }, [
    claimsData,
    lastRoundId,
    slotsData,
    hiddenHistoryRows,
    savedHiddenHistoryRows,
  ]);

  const gameData = useMemo(
    () =>
      encodeAbiParameters(
        [{ name: 'betsCount', type: 'uint256' }],
        [BigInt(numOfBets)],
      ),
    [numOfBets],
  );

  const claimMany = useCallback(
    async (betIds: string[]) => {
      if (!publicClient) return;

      const { request } = await publicClient
        .simulateContract({
          abi: slotsAbi,
          address: slotsAddress,
          functionName: 'claimMany',
          args: [betIds.map(BigInt)],
          account: address,
        })
        .catch((e) => {
          throw new Error(`Error while trying to claim from slots: ${e}`);
        });

      return walletClient?.writeContract(request);
    },
    [address, publicClient, slotsAddress, walletClient],
  );

  const handleClaim = useCallback(
    async (request: string | string[]) => {
      const data = Array.isArray(request) ? [...new Set(request)] : [request];
      const hash = await claimMany(data);

      if (hash && publicClient) {
        await publicClient.waitForTransactionReceipt({
          hash,
          confirmations: 2,
        });
      }

      await refreshBalances();
      trigger();
    },
    [claimMany, publicClient, refreshBalances, trigger],
  );

  const updateSlotsState = useCallback(
    async (rounds: SlotsRoundData[]) => {
      gamesCount.current = 0;
      while (gamesCount.current < rounds.length) {
        if (shouldStartGame.current) {
          const { winner, result, amountPaid } = rounds[gamesCount.current];
          const winningNumber = Number(winner) / 10000;
          const newSlot = findSlot(winningNumber);
          changeStartGame(false);
          setSlotsState((prev) =>
            generateSlotsMatrix({ prev, combination: newSlot?.combination }),
          );

          await delay(8300);

          setSlotsState((prev) => prev.map((row) => row.slice(-4)));
          setRoundIsRunning(false);
          setRecentResult(result);

          await delay(250);
          setRecentWin(Number(parseFloat(amountPaid) > 0 ? amountPaid : '0'));
          await delay(250);

          if (parseFloat(amountPaid) !== 0) {
            setDialogOpen(true);
          } else {
            changeStartGame(true);
          }
          gamesCount.current = gamesCount.current + 1;
          setHiddenHistoryRows((prev) => --prev);
          setSavedHiddenHistoryRows((prev) => --prev);
          await delay(1000);
          trigger();
        }
        await delay(2000);
      }

      setGameIsRunning(false);
      setLastRoundId(null);
    },
    [changeStartGame, setSavedHiddenHistoryRows, trigger],
  );

  useUserGameEvent({
    gameAddress: slotsAddress,
    eventName: 'GameEnd',
    onLogs: async (logs) => {
      const results = logs.map(({ args }) => ({
        betId: String(args.requestId),
        winner: String(args.randomNumber),
        result: Boolean(args.result),
        amountPaid: formatUnits(args.amountPaid, 18),
        userBet: String(recentTotalBetRef.current),
      }));

      if (results.length === 1 || modeRef.current === GameMode.Auto) {
        setHiddenHistoryRows(logs.length);
        setLastRoundId(String(logs[0].args.requestId));

        await updateSlotsState(results);
      } else {
        setSavedHiddenHistoryRows(logs.length);
        setSlotsData(results);
        setGameIsRunning(false);
      }
      await refreshBalances();
    },
  });

  const handleBet = async () => {
    setGameIsRunning(true);
    slotsAudio.play();
    const roundBet = parseUnits(betAmount, 18);
    recentTotalBetRef.current = Number(betAmount);
    modeRef.current = mode;

    const roundSlotsData = [...(slotsDataRef.current || [])];
    const localRoundData = roundSlotsData[0];
    if (
      modeRef.current === GameMode.Manual &&
      roundSlotsData.length > 0 &&
      localRoundData
    ) {
      recentTotalBetRef.current = +localRoundData.userBet;
      await updateSlotsState([localRoundData]);

      const newSlotsData = roundSlotsData.slice(1);
      setSlotsData(newSlotsData);
      slotsDataRef.current = newSlotsData;

      if (roundSlotsData.length === 1) {
        await refreshBalances();
      }
      return setGameIsRunning(false);
    }

    try {
      await checkAllowance(finalBetWithFee * BigInt(numOfBets));
      await startGame(roundBet, gameData);
    } catch {
      return setGameIsRunning(false);
    }
  };

  useEffect(() => {
    if (slotsState && slotsState[0].length !== 4) {
      setRoundIsRunning(true);
    }
  }, [slotsState]);

  useEffect(() => {
    slotsDataRef.current = slotsData;
  }, [slotsData]);

  return (
    <>
      <div className="grid grid-cols-1 gap-10 p-3 lg:p-6">
        <GameSection>
          <SlotsCalculator
            recentWin={recentWin}
            mode={mode}
            setMode={setMode}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            numOfBets={numOfBets}
            setNumOfBets={setNumOfBets}
            onBet={handleBet}
            gameIsRunning={gameIsRunning}
            setGameIsRunning={setGameIsRunning}
            gameData={gameData}
            maxBetCount={Number(maxBetCount || 24)}
          />
          <SlotsGame
            slotsState={slotsState}
            roundIsRunning={roundIsRunning}
            recentResult={recentResult}
          />
        </GameSection>
        <SlotsGameRatings
          ratings={showRatings}
          ratingsLoading={claimsLoading}
          onClaim={handleClaim}
        />
        <GameInfo config={slotsInfoConfig} />
      </div>

      <WinDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        amount={recentWin}
        bet={recentTotalBetRef.current}
        onClose={modalClose}
      />
    </>
  );
};
