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
  GameModeSelector,
  type GameMode,
} from '@/components/game-calculator/mode-selector';
import RecentWin from '@/components/game-calculator/recent-win';
import { TransactionInProgress } from '@/components/transaction-in-progress.tsx';
import Minus from '@/components/ui/svg/minus.svg';
import Plus from '@/components/ui/svg/plus.svg';
import { getContractAddresses } from '@/constants/contracts';
import {
  MAX_TARGET_COEFFICIENT,
  MIN_TARGET_COEFFICIENT,
} from '@/constants/slide';
import { useActiveToken } from '@/hooks/useActiveToken';
import { useBetAmounts } from '@/hooks/useBetAmounts';
import { useCoeffInput } from '@/hooks/useCoeffInput';
import { useRefund } from '@/hooks/useRefund';
import { useRefundWrite } from '@/hooks/useRefundWrite';
import { cn } from '@/lib/utils';

export default function SlideCalculator({
  mode,
  setMode,
  targetValue,
  setTargetValue,
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
  targetValue: string;
  setTargetValue: Dispatch<SetStateAction<string>>;
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
  const { isConnected } = useAccount();

  const chainId = useChainId();
  const { activeToken } = useActiveToken();
  const { slide: slideAddress } = getContractAddresses(chainId);
  const { address } = useAccount();
  const ongoingGame = useRefund(slideAddress, 'slide');
  const refundNeeded = useMemo(() => !!ongoingGame, [ongoingGame]);
  const refund = useRefundWrite(slideAddress, address);
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
    slideAddress,
    gameData,
  );

  const { handleInputChange, handleDecrement, handleIncrement } = useCoeffInput(
    {
      minCoeff: MIN_TARGET_COEFFICIENT,
      maxCoeff: MAX_TARGET_COEFFICIENT,
      value: targetValue,
      setValue: setTargetValue,
    },
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

      <div
        className={cn(
          'flex flex-col gap-2',
          !isConnected ? 'pointer-events-none opacity-40' : '',
        )}
      >
        <p className="text-sm text-[#8C98A9]">Target Value</p>
        <div className="flex justify-between gap-4 rounded-[34px] bg-[#161928] px-4 py-2">
          <input
            disabled={gameIsRunning}
            className="bet-input w-3/5 bg-[#161928] outline-none"
            value={targetValue}
            onChange={handleInputChange}
            placeholder={String(MIN_TARGET_COEFFICIENT)}
            data-cy="slideTargerCoeffInput"
          />
          <div className="flex items-center gap-1">
            <button
              disabled={
                parseFloat(targetValue) <= MIN_TARGET_COEFFICIENT ||
                gameIsRunning
              }
              className="transition-opacity disabled:opacity-65"
              onClick={handleDecrement}
            >
              <img className="h-5 min-w-5" src={Minus} alt="-" />
            </button>
            <button
              className="transition-opacity disabled:opacity-65"
              onClick={handleIncrement}
            >
              <img className="h-5 min-w-5" src={Plus} alt="+" />
            </button>
          </div>
        </div>
      </div>

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
      />
      <TransactionInProgress
        gameAddress={slideAddress}
        className="-order-1 1.5xl:order-none"
      />
    </div>
  );
}
