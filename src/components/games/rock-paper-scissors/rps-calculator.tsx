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
import {
  type RockPaperScissorsVariant,
  rpsGameConfig,
} from '@/constants/rock-paper-scissors';
import { useActiveToken } from '@/hooks/useActiveToken';
import { useBetAmounts } from '@/hooks/useBetAmounts';
import { useRefund } from '@/hooks/useRefund';
import { useRefundWrite } from '@/hooks/useRefundWrite';
import { cn } from '@/lib/utils';
import { type RpsGameState } from '@/pages/rock-paper-scissors';

export default function RockPaperScissorsCalculator({
  mode,
  setMode,
  selectedSide,
  setSelectedSide,
  setOppositeSide,
  setRecentResult,
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
  selectedSide: RockPaperScissorsVariant;
  setSelectedSide: Dispatch<SetStateAction<RockPaperScissorsVariant>>;
  setOppositeSide: Dispatch<SetStateAction<RockPaperScissorsVariant | null>>;
  setRecentResult: Dispatch<SetStateAction<RpsGameState>>;
  setGameIsRunning: Dispatch<SetStateAction<boolean>>;
  betAmount: string;
  setBetAmount: Dispatch<SetStateAction<string>>;
  numOfBets: number;
  setNumOfBets: Dispatch<SetStateAction<number>>;
  recentWin: number;
  onBet: () => void;
  gameIsRunning: boolean;
  gameData: `0x${string}`;
  maxBetCount: number;
}) {
  const chainId = useChainId();
  const { rps: rpsAddress } = getContractAddresses(chainId);
  const { activeToken } = useActiveToken();
  const { address } = useAccount();
  const ongoingGame = useRefund(rpsAddress, 'rockPaperScissors');
  const refundNeeded = useMemo(() => !!ongoingGame, [ongoingGame]);
  const refund = useRefundWrite(rpsAddress, address);
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
    rpsAddress,
    gameData,
  );

  const handleOptionClick = (name: RockPaperScissorsVariant) => {
    setSelectedSide(name);
    setOppositeSide(null);
    setRecentResult(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <GameModeSelector mode={mode} setMode={setMode} />

      <div className="flex flex-col gap-2">
        <h6 className="text-sm text-[#8C98A9]">Pick a Side</h6>
        <div className="grid grid-cols-3 gap-2">
          {rpsGameConfig.map(({ id, name, img }) => (
            <button
              key={id}
              disabled={gameIsRunning}
              data-cy={'setSelectedSide' + name}
              onClick={() => handleOptionClick(name)}
              className={cn(
                'flex flex-col items-center justify-between gap-2 rounded-[26px] border-[3px] bg-[#161928] p-3 transition-colors',
                selectedSide === name
                  ? 'border-[#9747FF]'
                  : 'border-transparent',
                gameIsRunning
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer hover:bg-[#1e2337]',
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
        gameAddress={rpsAddress}
        className="-order-1 1.5xl:order-none"
      />
    </div>
  );
}
