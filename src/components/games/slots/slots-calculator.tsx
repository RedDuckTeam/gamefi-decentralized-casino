import {
  useCallback,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useAccount, useChainId } from 'wagmi';

import SlotBetButton from './slot-bet-button';

import AutobetInput from '@/components/game-calculator/autobet-input';
import BetCalculator from '@/components/game-calculator/bet-input';
import {
  GameMode,
  GameModeSelector,
} from '@/components/game-calculator/mode-selector';
import RecentWin from '@/components/game-calculator/recent-win';
import { TransactionInProgress } from '@/components/transaction-in-progress.tsx';
import { getContractAddresses } from '@/constants/contracts';
import { useActiveToken } from '@/hooks/useActiveToken';
import { useBetAmounts } from '@/hooks/useBetAmounts';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useRefund } from '@/hooks/useRefund';
import { useRefundWrite } from '@/hooks/useRefundWrite';
import { type SlotsRoundData } from '@/pages/slots';

export default function SlotsCalculator({
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
  const chainId = useChainId();
  const { slots: slotsAddress } = getContractAddresses(chainId);

  const { activeToken } = useActiveToken();
  const ongoingGame = useRefund(slotsAddress, 'slots');
  const { address } = useAccount();
  const refundNeeded = useMemo(() => !!ongoingGame, [ongoingGame]);
  const refund = useRefundWrite(slotsAddress, address);
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
    slotsAddress,
    gameData,
  );

  const [slotsData] = useLocalStorage<SlotsRoundData[]>(`slots`, []);

  return (
    <div className="flex flex-col gap-6">
      <GameModeSelector mode={mode} setMode={setMode} />
      <BetCalculator
        mode={mode}
        betAmount={
          mode === GameMode.Manual && slotsData.length > 0
            ? slotsData[slotsData.length - 1]?.userBet
            : betAmount
        }
        setBetAmount={setBetAmount}
        numOfBets={numOfBets}
        setNumOfBets={setNumOfBets}
        minAmount={minAmount}
        maxAmount={maxAmount}
        maxBetCount={maxBetCount}
        disabled={mode === GameMode.Manual && slotsData.length > 0}
      />
      {mode == GameMode.Manual ? (
        <div className="-mt-2">
          <AutobetInput
            disabled={slotsData.length > 0}
            numOfBets={slotsData.length || numOfBets}
            setNumOfBets={setNumOfBets}
            maxBetCount={maxBetCount}
          />
        </div>
      ) : null}
      <RecentWin recentWin={recentWin} />
      <SlotBetButton
        className="-order-1 1.5xl:order-none"
        mode={mode}
        numOfBets={numOfBets}
        slotsData={slotsData}
        betAmount={betAmount}
        gameIsRunning={gameIsRunning}
        minAmount={minAmount}
        onBet={onBet}
        refundNeeded={refundNeeded}
        ongoingGame={ongoingGame}
        onRefund={onRefund}
      />
      <TransactionInProgress
        gameAddress={slotsAddress}
        className="-order-1 1.5xl:order-none"
      />
    </div>
  );
}
