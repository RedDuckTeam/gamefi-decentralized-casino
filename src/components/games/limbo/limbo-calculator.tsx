import {
  useCallback,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { formatUnits } from 'viem';
import { useAccount, useChainId } from 'wagmi';

import BetButton from '@/components/bet-button';
import BetCalculator from '@/components/game-calculator/bet-input';
import {
  GameModeSelector,
  type GameMode,
} from '@/components/game-calculator/mode-selector';
import RecentWin from '@/components/game-calculator/recent-win';
import { TransactionInProgress } from '@/components/transaction-in-progress.tsx';
import { getContractAddresses } from '@/constants/contracts';
import { MIN_TARGET_COEFFICIENT } from '@/constants/limbo';
import { useActiveToken } from '@/hooks/useActiveToken';
import { useBetAmounts } from '@/hooks/useBetAmounts';
import { useRefund } from '@/hooks/useRefund';
import { useRefundWrite } from '@/hooks/useRefundWrite';

export default function LimboCalculator({
  mode,
  setMode,
  betAmount,
  setBetAmount,
  numOfBets,
  setNumOfBets,
  recentWin,
  onBet,
  gameIsRunning,
  targetCoeff,
  gameData,
  maxBetCount,
  setGameIsRunning,
}: {
  mode: GameMode;
  setMode: Dispatch<SetStateAction<GameMode>>;
  betAmount: string;
  setBetAmount: Dispatch<SetStateAction<string>>;
  numOfBets: number;
  setNumOfBets: Dispatch<SetStateAction<number>>;
  setGameIsRunning: Dispatch<SetStateAction<boolean>>;
  recentWin: number;
  onBet: () => void;
  gameIsRunning: boolean;
  targetCoeff: string;
  gameData: `0x${string}`;
  maxBetCount: number;
}) {
  const { activeToken } = useActiveToken();
  const chainId = useChainId();
  const { limbo: limboAddress } = getContractAddresses(chainId);
  const { address } = useAccount();
  const ongoingGame = useRefund(limboAddress, 'limbo');
  const refundNeeded = useMemo(() => !!ongoingGame, [ongoingGame]);
  const refund = useRefundWrite(limboAddress, address);
  const onRefund = useCallback(
    async (arg: bigint) => {
      await refund({
        args: [arg],
      });
      setGameIsRunning(false);
    },
    [refund, setGameIsRunning],
  );
  const { minAmount, maxAmount } = useBetAmounts(
    activeToken?.address,
    limboAddress,
    gameData,
  );

  return (
    <div className="flex flex-col gap-6">
      <GameModeSelector mode={mode} setMode={setMode} />

      <BetCalculator
        mode={mode}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        numOfBets={numOfBets}
        setNumOfBets={setNumOfBets}
        minAmount={minAmount}
        maxAmount={maxAmount}
        maxBetCount={maxBetCount}
      />
      <RecentWin recentWin={recentWin} />
      <BetButton
        className="-order-1 1.5xl:order-none"
        betAmount={betAmount}
        gameIsRunning={gameIsRunning}
        minAmount={minAmount}
        onBet={onBet}
        refundNeeded={refundNeeded}
        onRefund={onRefund}
        ongoingGame={ongoingGame}
        disabled={
          !betAmount ||
          gameIsRunning ||
          betAmount === '0' ||
          !targetCoeff ||
          parseFloat(targetCoeff) < MIN_TARGET_COEFFICIENT ||
          parseFloat(betAmount) < parseFloat(formatUnits(minAmount, 18))
        }
      />
      <TransactionInProgress
        gameAddress={limboAddress}
        className="-order-1 1.5xl:order-none"
      />
    </div>
  );
}
