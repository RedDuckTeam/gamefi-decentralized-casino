import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { encodeAbiParameters, formatUnits, parseUnits } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi';
import { wheelSpinAudio } from '@/api/sound.ts';
import { GameMode } from '@/components/game-calculator/mode-selector';
import { GameInfo, GameRatings, GameSection } from '@/components/game-layout';
import { SlideCalculator, SlideGame } from '@/components/games/slide';
import { WinDialog } from '@/components/ui/win-dialog';
import { getContractAddresses } from '@/constants/contracts';
import { slideInfoConfig } from '@/constants/slide';
import { useGameRatings } from '@/hooks/useGameRatings';
import { useLocalVrfAutoFulfill } from '@/hooks/useLocalVrfAutoFulfill';
import { usePendingRoundRatings } from '@/hooks/usePendingRoundRatings';
import { usePlayGame } from '@/hooks/usePlayGame';
import { useRecentWinsStore } from '@/hooks/useRecentWinsState.ts';
import { useTokensBalances } from '@/hooks/useTokensBalances';
import { useUserGameEvent } from '@/hooks/useUserGameEvent';
import { delay } from '@/lib/delay';
import { generateSlideArray } from '@/lib/generateSlideArray';

type SlideRoundData = {
  requestId: string;
  winner: string;
  result: boolean;
  amountPaid: bigint;
};

export type SlideHistory = {
  state: boolean;
  result: string;
};

const slideInitialState = generateSlideArray(60);

export const SlidePage = () => {
  const chainId = useChainId();
  const { slide: slideAddress } = getContractAddresses(chainId);
  const { refreshBalances } = useTokensBalances();
  const { ratings, ratingsLoading, trigger } = useGameRatings('slide');
  const { visibleRatings, markRoundPending, revealNextRow, clearPendingRound } =
    usePendingRoundRatings(ratings);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<GameMode>(GameMode.Manual);
  const [numOfBets, setNumOfBets] = useState(1);
  const [betAmount, setBetAmount] = useState('0');
  const betRef = useRef(betAmount);
  const [recentTotalBet, setRecentTotalBet] = useState(0);

  const [recentResult, setRecentResult] = useState<boolean | null>(null);
  const [targetValue, setTargetValue] = useState('1.1');

  const [recentWin, setRecentWin] = useState(0);
  const { slideRecentWins, getSlideRecentWins, setSlideRecentWins } =
    useRecentWinsStore();

  const [cards, setCards] = useState<number[]>(slideInitialState);
  const [gameIsRunning, setGameIsRunning] = useState(false);
  const [roundIsRunning, setRoundIsRunning] = useState(false);

  const { startGame, checkAllowance, finalBetWithFee } = usePlayGame(
    slideAddress,
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
    address: slideAddress,
    functionName: 'getMaxBetCount',
  });

  const roundNumOfBets = useMemo(
    () => BigInt(mode === GameMode.Auto ? numOfBets : 1),
    [mode, numOfBets],
  );

  useLocalVrfAutoFulfill({
    gameAddress: slideAddress,
    mockRandomMax: 74n,
    numOfBets: roundNumOfBets,
  });

  const gameData = useMemo(
    () =>
      encodeAbiParameters(
        [
          { name: 'betsCount', type: 'uint256' },
          { name: 'userBet', type: 'uint256' },
        ],
        [
          roundNumOfBets,
          BigInt((parseFloat(targetValue) * 10000 || 0).toFixed(0)),
        ],
      ),
    [roundNumOfBets, targetValue],
  );

  const updateSlideState = useCallback(
    async (rounds: SlideRoundData[]) => {
      gamesCount.current = 0;
      while (gamesCount.current < rounds.length) {
        if (shouldStartGame.current) {
          const round = rounds[gamesCount.current];
          changeStartGame(false);
          setRoundIsRunning(true);
          wheelSpinAudio.play();

          const winner =
            String(round.winner).split('.')[1].length === 0
              ? round.winner
              : parseFloat(round.winner).toFixed(2);

          setCards((prevSlides) => [
            ...prevSlides,
            ...generateSlideArray(60, +winner),
          ]);

          await delay(10_000);

          setRecentWin(
            Number(
              round.amountPaid > 0 ? formatUnits(round.amountPaid, 18) : '0',
            ),
          );

          let recentResult = false;

          if (round.amountPaid !== 0n) {
            recentResult = true;
            setDialogOpen(true);
          } else {
            changeStartGame(true);
          }

          await delay(500);

          await refreshBalances();
          await trigger();

          setCards((prevSlides) => prevSlides.slice(60));
          setRecentResult(round.result);

          setSlideRecentWins(
            [
              ...getSlideRecentWins(),
              { state: recentResult, result: winner },
            ].slice(-3),
          );

          setRoundIsRunning(false);
          revealNextRow();
          gamesCount.current = gamesCount.current + 1;

          await delay(1500);
        }
        await delay(2000);
      }
      clearPendingRound();
      setGameIsRunning(false);
    },
    [
      changeStartGame,
      clearPendingRound,
      getSlideRecentWins,
      revealNextRow,
      trigger,
      refreshBalances,
      setSlideRecentWins,
    ],
  );

  useUserGameEvent({
    gameAddress: slideAddress,
    eventName: 'GameEnd',
    onLogs: (logs) => {
      markRoundPending(String(logs[0].args.requestId), logs.length);

      updateSlideState(
        logs.map(({ args }) => ({
          requestId: String(args.requestId),
          amountPaid: args.amountPaid,
          winner: formatUnits(args.randomNumber, 22),
          result: args.result,
        })),
      );
    },
  });

  const handleBet = async () => {
    setGameIsRunning(true);
    const roundBet = parseUnits(betAmount, 18);
    setRecentTotalBet(Number(betRef.current));

    try {
      await checkAllowance(finalBetWithFee * roundNumOfBets);
      await startGame(roundBet, gameData);
    } catch {
      return setGameIsRunning(false);
    }
  };

  useEffect(() => {
    betRef.current = betAmount;
  }, [betAmount]);

  return (
    <>
      <div className="grid grid-cols-1 gap-10 p-3 lg:p-6">
        <GameSection>
          <SlideCalculator
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
            targetValue={targetValue}
            setTargetValue={setTargetValue}
            gameData={gameData}
            maxBetCount={Number(maxBetCount || 100)}
          />
          <SlideGame
            cards={cards}
            innitialSize={slideInitialState.length}
            roundIsRunning={roundIsRunning}
            recentResult={recentResult}
            recentWins={slideRecentWins}
          />
        </GameSection>
        <GameRatings ratings={visibleRatings} ratingsLoading={ratingsLoading} />
        <GameInfo config={slideInfoConfig} />
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
