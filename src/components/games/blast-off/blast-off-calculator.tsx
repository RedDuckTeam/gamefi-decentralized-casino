import {
  useMemo,
  type Dispatch,
  type SetStateAction,
  useCallback,
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
import Minus from '@/components/ui/svg/minus.svg';
import Plus from '@/components/ui/svg/plus.svg';
import {
  MAX_TARGET_COEFFICIENT,
  MIN_TARGET_COEFFICIENT,
} from '@/constants/blast-off';
import { getContractAddresses } from '@/constants/contracts';
import { useActiveToken } from '@/hooks/useActiveToken';
import { useBetAmounts } from '@/hooks/useBetAmounts';
import { useCoeffInput } from '@/hooks/useCoeffInput';
import { useRefund } from '@/hooks/useRefund';
import { useRefundWrite } from '@/hooks/useRefundWrite';
import { getValueWithComa } from '@/lib/getValueWithComa';

export default function BlastOffCalculator({
  mode,
  setMode,
  betAmount,
  setBetAmount,
  numOfBets,
  setNumOfBets,
  targetCoeff,
  setTargetCoeff,
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
  targetCoeff: string;
  setTargetCoeff: (targetCoeff: string) => void;
  recentWin: number;
  onBet: () => void;
  gameIsRunning: boolean;
  gameData: `0x${string}`;
  maxBetCount: number;
}) {
  const { activeToken } = useActiveToken();
  const chainId = useChainId();
  const { blastOff: blastOffAddress } = getContractAddresses(chainId);
  const { address } = useAccount();

  const ongoingGame = useRefund(blastOffAddress, 'blastOff');
  const refundNeeded = useMemo(() => !!ongoingGame, [ongoingGame]);
  const refund = useRefundWrite(blastOffAddress, address);
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
    blastOffAddress,
    gameData,
  );
  const { handleInputChange, handleDecrement, handleIncrement } = useCoeffInput(
    {
      minCoeff: MIN_TARGET_COEFFICIENT,
      maxCoeff: MAX_TARGET_COEFFICIENT,
      value: targetCoeff,
      setValue: setTargetCoeff,
    },
  );

  return (
    <div className="flex flex-col gap-6">
      <GameModeSelector mode={mode} setMode={setMode} />

      <BetCalculator
        minAmount={minAmount}
        maxAmount={maxAmount}
        mode={mode}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        numOfBets={numOfBets}
        setNumOfBets={setNumOfBets}
        maxBetCount={maxBetCount}
      />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="text-sm text-[#8C98A9]">Target coefficient</p>
          <p className="text-sm text-text">
            {targetCoeff && targetCoeff !== '0'
              ? `${getValueWithComa(targetCoeff)}x`
              : '-'}
          </p>
        </div>
        <div className="flex gap-4 rounded-[34px] bg-[#161928] px-4 py-2">
          <input
            value={targetCoeff}
            onChange={handleInputChange}
            className="bet-input w-full bg-[#161928] outline-none"
            type="string"
            placeholder="0"
          />
          <div className="flex items-center gap-1">
            <button
              onClick={handleDecrement}
              className="transition-opacity disabled:opacity-65"
              disabled={
                parseFloat(targetCoeff) <= MIN_TARGET_COEFFICIENT ||
                gameIsRunning
              }
            >
              <img className="h-5 min-w-5" src={Minus} alt="-" />
            </button>
            <button
              onClick={handleIncrement}
              className="transition-opacity disabled:opacity-65"
              disabled={
                parseFloat(targetCoeff) >= MAX_TARGET_COEFFICIENT ||
                gameIsRunning
              }
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
        gameAddress={blastOffAddress}
        className="-order-1 1.5xl:order-none"
      />
    </div>
  );
}
