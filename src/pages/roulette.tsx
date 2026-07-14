import { type CheckedState } from '@radix-ui/react-checkbox';
import { useCallback, useMemo, useRef, useState } from 'react';
import { encodeAbiParameters, formatUnits } from 'viem';
import { useChainId, usePublicClient, useReadContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi';
import { GameInfo, GameRatings, GameSection } from '@/components/game-layout';
import { RouletteCalculator, RouletteGame } from '@/components/games/roulette';
import { RouletteProvider } from '@/components/games/roulette/shared/roulette-provider';
import OddsAndPayouts from '@/components/odds-and-payouts';
import { WinDialog } from '@/components/ui/win-dialog';
import { getContractAddresses } from '@/constants/contracts';
import {
  rouletteInfoConfig,
  mockRouletteOddsAndPayouts,
} from '@/constants/roulette';
import { getTokensConfig } from '@/constants/tokens';
import { useActiveToken } from '@/hooks/useActiveToken';
import { useGameRatings } from '@/hooks/useGameRatings';
import { useLocalVrfAutoFulfill } from '@/hooks/useLocalVrfAutoFulfill';
import { usePendingRoundRatings } from '@/hooks/usePendingRoundRatings';
import { usePlayGame } from '@/hooks/usePlayGame';
import { useTokensBalances } from '@/hooks/useTokensBalances';
import { useUserGameEvent } from '@/hooks/useUserGameEvent';
import { delay } from '@/lib/delay';
import { parseRouletteBets } from '@/lib/parseRouletteBets';
import { type ChipValue } from '@/types/roulette';

type RouletteSpinData = {
  requestId: string;
  userBet: bigint;
  winningNumber: number;
  result: boolean;
  amountPaid: bigint;
};

export const RoulettePage = () => {
  const chainId = useChainId();
  const { roulette: rouletteAddress, ibetHelper: gmxHelperAddress } =
    getContractAddresses(chainId);
  const { refreshBalances } = useTokensBalances();
  const { ratings, ratingsLoading, trigger } = useGameRatings('roulette');
  const { visibleRatings, markRoundPending, revealNextRow, clearPendingRound } =
    usePendingRoundRatings(ratings);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [numOfBets, setNumOfBets] = useState(1);
  const [recentWin, setRecentWin] = useState(0);
  const [recentResult, setRecentResult] = useState(true);
  const [recentTotalBet, setRecentTotalBet] = useState(0);

  const [selectedNumber, setSelectedNumber] = useState(-1);
  const [betId, setBetId] = useState<number>(0);

  const [selectedChip, setSelectedChip] = useState<ChipValue | null>(null);
  const [gameIsRunning, setGameIsRunning] = useState(false);
  const [multibetEnabled, setMultibetEnabled] = useState<CheckedState>(false);
  const [roundBet, setRoundBet] = useState(0n);

  const { activeToken } = useActiveToken();
  const defaultToken = getTokensConfig(chainId)[0].address;

  const publicClient = usePublicClient();
  const { startGame, checkAllowance, finalBetWithFee } = usePlayGame(
    rouletteAddress,
    roundBet,
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
    address: rouletteAddress,
    functionName: 'getMaxBetCount',
  });

  const roundNumOfBets = useMemo(
    () => BigInt(multibetEnabled ? numOfBets : 1),
    [multibetEnabled, numOfBets],
  );

  useLocalVrfAutoFulfill({
    gameAddress: rouletteAddress,
    mockRandomMax: 1n,
    numOfBets: roundNumOfBets,
  });

  const spinTheWheel = useCallback(
    async (spins: RouletteSpinData[]) => {
      gamesCount.current = 0;
      while (gamesCount.current < spins.length) {
        if (shouldStartGame.current) {
          const spin = spins[gamesCount.current];
          changeStartGame(false);
          setSelectedNumber(spin.winningNumber);
          setBetId((prev) => prev + 1);

          await delay(10_000);
          setRecentResult(spin.result);

          setRecentWin(
            Number(
              spin.amountPaid > 0 ? formatUnits(spin.amountPaid, 18) : '0',
            ),
          );
          if (spin.amountPaid !== 0n) {
            setDialogOpen(true);
          } else {
            changeStartGame(true);
          }
          revealNextRow();

          gamesCount.current = gamesCount.current + 1;
          await refreshBalances();
          await trigger();
          await delay(2_000);
        }
        await delay(2000);
      }

      setGameIsRunning(false);
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
    gameAddress: rouletteAddress,
    eventName: 'GameEnd',
    onLogs: (logs) => {
      markRoundPending(String(logs[0].args.requestId), logs.length);

      spinTheWheel(
        logs.map(({ args }) => ({
          requestId: String(args.requestId),
          userBet: args.userBet,
          amountPaid: args.amountPaid,
          winningNumber: Number(args.randomNumber / 10000n) - 1,
          result: args.result,
        })),
      );
    },
  });

  const handleBet = async (
    bets: Map<string, ChipValue[]>,
    roundBet: bigint,
  ) => {
    if (!publicClient) return;

    setGameIsRunning(true);
    setRecentTotalBet(Number(formatUnits(roundBet, 18)));
    const result = await parseRouletteBets(
      bets,
      roundBet,
      activeToken?.address || defaultToken,
      gmxHelperAddress,
      publicClient,
    );

    try {
      await checkAllowance(finalBetWithFee * roundNumOfBets);
      await startGame(
        roundBet,
        encodeAbiParameters(
          [
            { name: 'betsCount', type: 'uint256' },
            { name: 'userBetAmount', type: 'uint256' },
            { name: 'userBets', type: 'uint256[37]' },
          ],
          [roundNumOfBets, roundBet, result],
        ),
      );
    } catch {
      return setGameIsRunning(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-10 p-3 lg:p-6">
        <RouletteProvider>
          <GameSection>
            <RouletteCalculator
              betAmount={roundBet * roundNumOfBets}
              setRoundBet={setRoundBet}
              recentWin={recentWin}
              multibetEnabled={multibetEnabled}
              setMultibetEnabled={setMultibetEnabled}
              onBet={handleBet}
              selectedChip={selectedChip}
              setSelectedChip={setSelectedChip}
              numOfBets={numOfBets}
              setNumOfBets={setNumOfBets}
              gameIsRunning={gameIsRunning}
              setGameIsRunning={setGameIsRunning}
              maxBetCount={Number(maxBetCount || 100)}
            />
            <RouletteGame
              selectedNumber={selectedNumber}
              betId={betId}
              selectedChip={selectedChip}
              recentResult={recentResult}
            />
          </GameSection>
          <GameRatings
            ratings={visibleRatings}
            ratingsLoading={ratingsLoading}
          />
          <GameInfo config={rouletteInfoConfig}>
            <OddsAndPayouts config={mockRouletteOddsAndPayouts} />
          </GameInfo>
        </RouletteProvider>
      </div>

      <WinDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        amount={recentWin}
        bet={recentTotalBet}
        onClose={modalClose}
      />
    </>
  );
};
