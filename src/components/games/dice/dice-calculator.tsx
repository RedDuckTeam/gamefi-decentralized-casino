import {
  useCallback,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useAccount, useChainId } from 'wagmi';

import BetButton from '@/components/bet-button';
import BetCalculator from '@/components/game-calculator/bet-input';
import {
  type GameMode,
  GameModeSelector,
} from '@/components/game-calculator/mode-selector';
import RecentWin from '@/components/game-calculator/recent-win';
import { TransactionInProgress } from '@/components/transaction-in-progress.tsx';
import { getContractAddresses } from '@/constants/contracts';
import { useActiveToken } from '@/hooks/useActiveToken';
import { useBetAmounts } from '@/hooks/useBetAmounts';
import { useRefund } from '@/hooks/useRefund';
import { useRefundWrite } from '@/hooks/useRefundWrite';

export default function DiceCalculator({
  mode,
  setMode,
  betAmount,
  setBetAmount,
  numOfBets,
  setNumOfBets,
  recentWin,
  onBet,
  gameIsRunning,
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
  gameData: `0x${string}`;
  maxBetCount: number;
}) {
  const { activeToken } = useActiveToken();
  const chainId = useChainId();
  const { dice: diceAddress } = getContractAddresses(chainId);
  const { address } = useAccount();

  const ongoingGame = useRefund(diceAddress, 'dice');
  const refundNeeded = useMemo(() => !!ongoingGame, [ongoingGame]);
  const refund = useRefundWrite(diceAddress, address);
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
    diceAddress,
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
        ongoingGame={ongoingGame}
        onRefund={onRefund}
      />
      <TransactionInProgress
        gameAddress={diceAddress}
        className="-order-1 1.5xl:order-none"
      />
    </div>
  );
}
