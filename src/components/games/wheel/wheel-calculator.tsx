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
import { getContractAddresses } from '@/constants/contracts';
import { WheelRisk } from '@/constants/wheel';
import { useActiveToken } from '@/hooks/useActiveToken';
import { useBetAmounts } from '@/hooks/useBetAmounts';
import { useRefund } from '@/hooks/useRefund';
import { useRefundWrite } from '@/hooks/useRefundWrite';
import { cn } from '@/lib/utils';

export default function WheelCalculator({
  mode,
  setMode,
  betAmount,
  selectedRisks,
  setSelectedRisks,
  setBetAmount,
  numOfBets,
  setNumOfBets,
  onBet,
  gameIsRunning,
  recentWin,
  gameData,
  setIsWin,
  maxBetCount,
  setGameIsRunning,
}: {
  mode: GameMode;
  setMode: Dispatch<SetStateAction<GameMode>>;
  betAmount: string;
  selectedRisks: WheelRisk;
  setSelectedRisks: Dispatch<SetStateAction<WheelRisk>>;
  setGameIsRunning: Dispatch<SetStateAction<boolean>>;
  setBetAmount: Dispatch<SetStateAction<string>>;
  numOfBets: number;
  setNumOfBets: Dispatch<SetStateAction<number>>;
  onBet: () => void;
  gameIsRunning: boolean;
  recentWin: number;
  gameData: `0x${string}`;
  setIsWin: Dispatch<SetStateAction<boolean | null>>;
  maxBetCount: number;
}) {
  const chainId = useChainId();
  const { wheel: wheelAddress } = getContractAddresses(chainId);
  const { activeToken } = useActiveToken();
  const ongoingGame = useRefund(wheelAddress, 'wheel');
  const { address } = useAccount();
  const refundNeeded = useMemo(() => !!ongoingGame, [ongoingGame]);
  const refund = useRefundWrite(wheelAddress, address);
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
    wheelAddress,
    gameData,
  );

  const handleRisksSelect = (risk: WheelRisk) => {
    setIsWin(null);
    setSelectedRisks(risk);
  };

  return (
    <div className="flex flex-col gap-6">
      <GameModeSelector mode={mode} setMode={setMode} />
      <div className="flex flex-col gap-2">
        <h6>Select Risks</h6>
        <div className="flex justify-between gap-1">
          {Object.values(WheelRisk).map((risk) => (
            <button
              key={risk}
              disabled={gameIsRunning}
              onClick={() => handleRisksSelect(risk)}
              className={cn(
                'flex w-[100px] flex-col items-center gap-2 rounded-[26px] border-[3px] border-transparent bg-[#161928] px-4 py-2 transition-all hover:border-purple',
                selectedRisks === risk ? 'border-purple' : '',
              )}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>
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
        gameAddress={wheelAddress}
        className="-order-1 1.5xl:order-none"
      />
    </div>
  );
}
