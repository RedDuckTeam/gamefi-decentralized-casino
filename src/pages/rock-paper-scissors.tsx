import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { encodeAbiParameters, formatUnits, parseUnits } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi';
import { paperAudio, scissorsAudio, stoneAudio } from '@/api/sound.ts';
import { GameMode } from '@/components/game-calculator/mode-selector';
import { GameInfo, GameRatings, GameSection } from '@/components/game-layout';
import {
  RockPaperScissorsCalculator,
  RockPaperScissorsGame,
} from '@/components/games/rock-paper-scissors';
import { DrawDialog } from '@/components/ui/draw-dialog';
import { WinDialog } from '@/components/ui/win-dialog';
import { getContractAddresses } from '@/constants/contracts';
import {
  RockPaperScissorsVariant,
  getRpsLoseState,
  getRpsWinState,
  mapRockPaperScissorsVariant,
  rockPaperScissorsInfoConfig,
} from '@/constants/rock-paper-scissors';
import { useGameRatings } from '@/hooks/useGameRatings';
import { useLocalVrfAutoFulfill } from '@/hooks/useLocalVrfAutoFulfill';
import { usePendingRoundRatings } from '@/hooks/usePendingRoundRatings';
import { usePlayGame } from '@/hooks/usePlayGame';
import { useRecentWinsStore } from '@/hooks/useRecentWinsState.ts';
import { useTokensBalances } from '@/hooks/useTokensBalances';
import { useUserGameEvent } from '@/hooks/useUserGameEvent';
import { delay } from '@/lib/delay';
import { predictRPSResult } from '@/lib/predictRPSResult';

type RpsRoundData = {
  requestId: string;
  winner: number;
  result: boolean;
  amountPaid: bigint;
};

export type RpsGameState = 'lose' | 'draw' | 'win' | null;
export type RpsHistory = {
  state: RpsGameState;
  variant: RockPaperScissorsVariant;
};

export const RockPaperScissorsPage = () => {
  const chainId = useChainId();
  const { rps: rpsAddress } = getContractAddresses(chainId);
  const { refreshBalances } = useTokensBalances();
  const { ratings, ratingsLoading, trigger } =
    useGameRatings('rockPaperScissors');
  const { visibleRatings, markRoundPending, revealNextRow, clearPendingRound } =
    usePendingRoundRatings(ratings);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawDialogOpen, setDrawDialogOpen] = useState(false);
  const [betAmount, setBetAmount] = useState('0');

  const [recentWin, setRecentWin] = useState(0);
  const [numOfBets, setNumOfBets] = useState(1);
  const [recentTotalBet, setRecentTotalBet] = useState(0);

  const [recentResult, setRecentResult] = useState<RpsGameState>(null);
  const [mode, setMode] = useState<GameMode>(GameMode.Manual);
  const [selectedSide, setSelectedSide] = useState<RockPaperScissorsVariant>(
    RockPaperScissorsVariant.ROCK,
  );

  const { rpsRecentWins, getRpsRecentWins, setRpsRecentWins } =
    useRecentWinsStore();

  const betRef = useRef(betAmount);
  const sideRef = useRef(selectedSide);

  const [oppositeSide, setOppositeSide] =
    useState<RockPaperScissorsVariant | null>(null);
  const [gameIsRunning, setGameIsRunning] = useState(false);

  const { startGame, checkAllowance, finalBetWithFee } = usePlayGame(
    rpsAddress,
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
    address: rpsAddress,
    functionName: 'getMaxBetCount',
  });

  const roundNumOfBets = useMemo(
    () => BigInt(mode === GameMode.Auto ? numOfBets : 1),
    [mode, numOfBets],
  );

  useLocalVrfAutoFulfill({
    gameAddress: rpsAddress,
    mockRandomMax: 1n,
    numOfBets: roundNumOfBets,
  });

  const gameData = useMemo(
    () =>
      encodeAbiParameters(
        [
          { name: 'betsCount', type: 'uint256' },
          { name: 'userBet', type: 'uint256' },
        ],
        [roundNumOfBets, mapRockPaperScissorsVariant(selectedSide)],
      ),
    [roundNumOfBets, selectedSide],
  );

  const updateRpsState = useCallback(
    async (
      selectedSide: RockPaperScissorsVariant,
      betAmount: string,
      rounds: RpsRoundData[],
    ) => {
      gamesCount.current = 0;
      while (gamesCount.current < rounds.length) {
        if (shouldStartGame.current) {
          setOppositeSide(null);
          setRecentResult(null);

          await delay(2000);

          const { amountPaid } = rounds[gamesCount.current];
          setRecentWin(+(amountPaid > 0 ? formatUnits(amountPaid, 18) : '0'));
          changeStartGame(false);

          const recentResult = predictRPSResult(
            parseUnits(betAmount, 18),
            amountPaid,
          );

          let oppositeSide: RockPaperScissorsVariant;

          if (recentResult === 'lose') {
            changeStartGame(true);
            oppositeSide = getRpsLoseState(selectedSide)!;
          } else if (recentResult === 'draw') {
            oppositeSide = selectedSide;
          } else {
            oppositeSide = getRpsWinState(selectedSide)!;
          }

          if (oppositeSide === RockPaperScissorsVariant.PAPER) {
            paperAudio.play();
          }
          if (oppositeSide === RockPaperScissorsVariant.ROCK) {
            stoneAudio.play();
          }
          if (oppositeSide === RockPaperScissorsVariant.SCISSORS) {
            scissorsAudio.play();
          }

          setRecentResult(recentResult);
          setOppositeSide(oppositeSide);
          setRpsRecentWins(
            [
              ...getRpsRecentWins(),
              { state: recentResult, variant: oppositeSide },
            ].slice(-3),
          );

          await delay(1000);

          if (recentResult === 'draw') {
            setDrawDialogOpen(true);
          } else if (recentResult === 'win') {
            setDialogOpen(true);
          }

          gamesCount.current = gamesCount.current + 1;
          await delay(2000);
        }

        await refreshBalances();
        await trigger();
        revealNextRow();
        await delay(2000);
      }
      setGameIsRunning(false);
      clearPendingRound();
    },
    [
      changeStartGame,
      clearPendingRound,
      getRpsRecentWins,
      revealNextRow,
      trigger,
      refreshBalances,
      setRpsRecentWins,
    ],
  );

  useUserGameEvent({
    gameAddress: rpsAddress,
    eventName: 'GameEnd',
    onLogs: (logs) => {
      markRoundPending(String(logs[0].args.requestId), logs.length);

      updateRpsState(
        sideRef.current,
        betRef.current,
        logs.map(({ args }) => ({
          requestId: String(args.requestId),
          winner: Number(args.secondRandomNumber),
          result: args.result,
          amountPaid: args.amountPaid,
        })),
      );
    },
  });

  const handleBet = async () => {
    setGameIsRunning(true);
    setOppositeSide(null);
    setRecentResult(null);
    setRecentTotalBet(Number(betRef.current));

    try {
      await checkAllowance(finalBetWithFee * roundNumOfBets);
      await startGame(parseUnits(betAmount, 18), gameData);
    } catch {
      return setGameIsRunning(false);
    }
  };

  useEffect(() => {
    betRef.current = betAmount;
    sideRef.current = selectedSide;
  }, [betAmount, selectedSide]);

  return (
    <>
      <div className="grid grid-cols-1 gap-10 p-3 lg:p-6">
        <GameSection>
          <RockPaperScissorsCalculator
            recentWin={recentWin}
            mode={mode}
            setMode={setMode}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            numOfBets={numOfBets}
            setNumOfBets={setNumOfBets}
            onBet={handleBet}
            selectedSide={selectedSide}
            setSelectedSide={setSelectedSide}
            setOppositeSide={setOppositeSide}
            setRecentResult={setRecentResult}
            gameIsRunning={gameIsRunning}
            setGameIsRunning={setGameIsRunning}
            gameData={gameData}
            maxBetCount={Number(maxBetCount || 100)}
          />
          <RockPaperScissorsGame
            selectedSide={selectedSide}
            oppositeSide={oppositeSide}
            recentResult={recentResult}
            recentWins={rpsRecentWins}
          />
        </GameSection>
        <GameRatings ratings={visibleRatings} ratingsLoading={ratingsLoading} />
        <GameInfo config={rockPaperScissorsInfoConfig} />
      </div>

      <WinDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        amount={recentWin}
        bet={recentTotalBet}
        onClose={modalClose}
      />
      <DrawDialog
        open={drawDialogOpen}
        setOpen={setDrawDialogOpen}
        onClose={modalClose}
      />
    </>
  );
};
