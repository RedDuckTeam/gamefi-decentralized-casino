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
import { type CoinflipVariant, coinflipConfig } from '@/constants/coinflip';
import { getContractAddresses } from '@/constants/contracts';
import { useActiveToken } from '@/hooks/useActiveToken';
import { useBetAmounts } from '@/hooks/useBetAmounts';
import { useRefund } from '@/hooks/useRefund';
import { useRefundWrite } from '@/hooks/useRefundWrite';
import { cn } from '@/lib/utils';

export default function CoinflipCalculator({
  mode,
  setMode,
  betAmount,
  setBetAmount,
  numOfBets,
  setNumOfBets,
  recentWin,
  setSelectedSide,
  setOppositeSide,
  setOppositeSideCopy,
  selectedSide,
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
  recentWin: number;
  setSelectedSide: Dispatch<SetStateAction<CoinflipVariant>>;
  setOppositeSide: Dispatch<SetStateAction<CoinflipVariant | null>>;
  setOppositeSideCopy: Dispatch<SetStateAction<CoinflipVariant | null>>;
  setGameIsRunning: Dispatch<SetStateAction<boolean>>;
  selectedSide: CoinflipVariant;
  onBet: () => void;
  gameIsRunning: boolean;
  gameData: `0x${string}`;
  maxBetCount: number;
}) {
  const { activeToken } = useActiveToken();
  const { address } = useAccount();
  const chainId = useChainId();
  const { coinflip: coinflipAddress } = getContractAddresses(chainId);
  const ongoingGame = useRefund(coinflipAddress, 'coinFlip');
  const refundNeeded = useMemo(() => !!ongoingGame, [ongoingGame]);
  const refund = useRefundWrite(coinflipAddress, address);
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
    coinflipAddress,
    gameData,
  );

  const handleOptionClick = (name: CoinflipVariant) => {
    setSelectedSide(name);
    setOppositeSide(null);
    setOppositeSideCopy(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <GameModeSelector mode={mode} setMode={setMode} />
      <div className="flex flex-col gap-2">
        <h6 className="text-sm text-[#8C98A9]">Pick a Side</h6>
        <div className="grid grid-cols-2 gap-2">
          {coinflipConfig.map(({ id, name, img }) => (
            <button
              key={id}
              disabled={gameIsRunning}
              data-cy={name}
              onClick={() => handleOptionClick(name)}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-between gap-2 rounded-[26px] border-[3px] bg-[#161928] p-3 transition-colors hover:bg-[#1e2337]',
                selectedSide === name
                  ? 'border-[#9747FF]'
                  : 'border-transparent',
              )}
            >
              <img className="h-[65px]" src={img} alt={name} />
              <p className="text-[16px] text-text">{name}</p>
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
        gameAddress={coinflipAddress}
        className="-order-1 1.5xl:order-none"
      />
    </div>
  );
}
