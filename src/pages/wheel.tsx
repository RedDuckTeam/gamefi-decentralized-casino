import { useCallback, useMemo, useRef, useState } from 'react';
import { encodePacked, formatUnits, parseUnits } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi';
import { wheelSpinAudio } from '@/api/sound.ts';
import { GameMode } from '@/components/game-calculator/mode-selector';
import { GameInfo, GameRatings, GameSection } from '@/components/game-layout';
import WheelCalculator from '@/components/games/wheel/wheel-calculator';
import WheelGame from '@/components/games/wheel/wheel-game';
import { WinDialog } from '@/components/ui/win-dialog';
import { getContractAddresses } from '@/constants/contracts';
import {
  WheelRisk,
  wheelInfoConfig,
  type WheelVariant,
} from '@/constants/wheel';
import { useGameRatings } from '@/hooks/useGameRatings';
import { useLocalVrfAutoFulfill } from '@/hooks/useLocalVrfAutoFulfill';
import { usePendingRoundRatings } from '@/hooks/usePendingRoundRatings';
import { usePlayGame } from '@/hooks/usePlayGame';
import { useTokensBalances } from '@/hooks/useTokensBalances';
import { useUserGameEvent } from '@/hooks/useUserGameEvent';
import { delay } from '@/lib/delay';
import { guessWheelWinner } from '@/lib/guessWheelWinner';

export interface WheelSpinData {
  requestId: string;
  userBet: bigint;
  result: boolean;
  amountPaid: bigint;
}

export const WheelPage = () => {
  const chainId = useChainId();
  const { wheel: wheelAddress } = getContractAddresses(chainId);
  const { refreshBalances } = useTokensBalances();
  const { ratings, ratingsLoading, trigger } = useGameRatings('wheel');
  const { visibleRatings, markRoundPending, revealNextRow, clearPendingRound } =
    usePendingRoundRatings(ratings);

  const [numOfBets, setNumOfBets] = useState(1);
  const [winAmount, setWinAmount] = useState('0');
  const [betAmount, setBetAmount] = useState('0');
  const [recentBetAmount, setRecentBetAmount] = useState('0');
  const [gameIsRunning, setGameIsRunning] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<WheelVariant | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isWin, setIsWin] = useState<boolean | null>(null);

  const [mode, setMode] = useState<GameMode>(GameMode.Manual);
  const [betId, setBetId] = useState<number>(0);
  const [localBetId, setLocalBetId] = useState(0);
  const [selectedRisks, setSelectedRisks] = useState<WheelRisk>(WheelRisk.LOW);

  const risksRef = useRef(selectedRisks);
  const betRef = useRef(betAmount);

  const { startGame, checkAllowance, finalBetWithFee } = usePlayGame(
    wheelAddress,
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
    address: wheelAddress,
    functionName: 'getMaxBetCount',
  });

  const roundNumOfBets = useMemo(
    () => BigInt(mode === GameMode.Auto ? numOfBets : 1),
    [mode, numOfBets],
  );

  useLocalVrfAutoFulfill({
    gameAddress: wheelAddress,
    mockRandomMax: 4n,
    numOfBets: roundNumOfBets,
  });

  const gameData = useMemo(
    () =>
      encodePacked(
        ['uint256', 'uint256'],
        [
          roundNumOfBets,
          BigInt(Object.values(WheelRisk).indexOf(selectedRisks)),
        ],
      ),
    [roundNumOfBets, selectedRisks],
  );

  const spinTheWheel = async (spins: WheelSpinData[]) => {
    gamesCount.current = 0;
    while (gamesCount.current < spins.length) {
      if (shouldStartGame.current) {
        wheelSpinAudio.play();
        const spin = spins[gamesCount.current];
        const winner = guessWheelWinner(
          +betRef.current,
          +formatUnits(spin.amountPaid, 18),
          risksRef.current,
        );

        setBetId(Number(spin.requestId));
        setLocalBetId((prev) => ++prev);
        setSelectedVariant(winner);

        changeStartGame(false);
        await delay(10_000);
        setWinAmount(
          spin.amountPaid > 0 ? formatUnits(spin.amountPaid, 18) : '0',
        );
        const win = spin.amountPaid >= parseUnits(betAmount, 18);
        setIsWin(win);
        setDialogOpen(win);
        revealNextRow();
        gamesCount.current = gamesCount.current + 1;
        await delay(2_000);

        if (gamesCount.current !== spins.length - 1) {
          setSelectedVariant(null);
          setIsWin(null);
        }
      }
      await refreshBalances();
      await trigger();
      await delay(2000);
    }
    clearPendingRound();
    setGameIsRunning(false);
  };

  useUserGameEvent({
    gameAddress: wheelAddress,
    eventName: 'GameEnd',
    onLogs: async (logs) => {
      markRoundPending(String(logs[0].args.requestId), logs.length);

      setSelectedVariant(null);
      await spinTheWheel(
        logs.map(({ args }) => ({
          requestId: String(args.requestId),
          userBet: args.userBet,
          result: args.result,
          amountPaid: args.amountPaid,
        })),
      );
    },
  });

  const handleBet = async () => {
    setSelectedVariant(null);
    setIsWin(null);
    setGameIsRunning(true);
    setRecentBetAmount(betAmount);
    risksRef.current = selectedRisks;
    betRef.current = betAmount;

    try {
      await checkAllowance(finalBetWithFee * BigInt(roundNumOfBets));
      await startGame(betAmount, gameData);
    } catch {
      return setGameIsRunning(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-10 p-3 lg:p-6">
        <GameSection>
          <WheelCalculator
            mode={mode}
            setMode={setMode}
            selectedRisks={selectedRisks}
            setSelectedRisks={setSelectedRisks}
            betAmount={betAmount}
            numOfBets={numOfBets}
            setNumOfBets={setNumOfBets}
            setBetAmount={setBetAmount}
            onBet={handleBet}
            gameIsRunning={gameIsRunning}
            setGameIsRunning={setGameIsRunning}
            recentWin={parseFloat(winAmount)}
            gameData={gameData}
            setIsWin={setIsWin}
            maxBetCount={Number(maxBetCount || 100)}
          />
          <WheelGame
            betId={betId}
            localBetId={localBetId}
            selectedVariant={selectedVariant}
            selectedRisks={selectedRisks}
            isWin={isWin}
          />
        </GameSection>
        <GameRatings ratings={visibleRatings} ratingsLoading={ratingsLoading} />
        <GameInfo config={wheelInfoConfig} />
      </div>

      <WinDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        amount={+winAmount}
        bet={+recentBetAmount}
        onClose={modalClose}
      />
    </>
  );
};
