import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import {
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
  useCallback,
} from 'react';
import { formatUnits } from 'viem';
import { useAccount, useChainId } from 'wagmi';

import { RouletteContext } from './shared/roulette-context';

import BetButton from '@/components/bet-button';
import AutobetInput from '@/components/game-calculator/autobet-input';
import RecentWin from '@/components/game-calculator/recent-win';
import TokenSelect from '@/components/game-calculator/token-select';
import { TransactionInProgress } from '@/components/transaction-in-progress.tsx';
import Chip from '@/components/ui/chip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import { getContractAddresses } from '@/constants/contracts';
import {
  chipsSequence,
  rouletteBetAmountData,
  rouletteChipsConfig,
} from '@/constants/roulette';
import { useActiveToken } from '@/hooks/useActiveToken';
import { useBetAmounts } from '@/hooks/useBetAmounts';
import { useRefund } from '@/hooks/useRefund';
import { useRefundWrite } from '@/hooks/useRefundWrite';
import { useTokensBalances } from '@/hooks/useTokensBalances';
import { chipValuePriceMap, getRoundBet } from '@/lib/parseRouletteBets';
import { cn, formatWithComma } from '@/lib/utils';
import { type ChipValue } from '@/types/roulette';

export default function RouletteCalculator({
  betAmount,
  setRoundBet,
  numOfBets,
  multibetEnabled,
  setMultibetEnabled,
  setNumOfBets,
  recentWin,
  onBet,
  selectedChip,
  setSelectedChip,
  gameIsRunning,
  maxBetCount,
  setGameIsRunning,
}: {
  betAmount: bigint;
  setRoundBet: Dispatch<SetStateAction<bigint>>;
  setGameIsRunning: Dispatch<SetStateAction<boolean>>;
  numOfBets: number;
  multibetEnabled: Checkbox.CheckedState;
  setMultibetEnabled: Dispatch<React.SetStateAction<Checkbox.CheckedState>>;
  setNumOfBets: Dispatch<SetStateAction<number>>;
  recentWin: number;
  onBet: (bets: Map<string, ChipValue[]>, roundBet: bigint) => void;
  selectedChip: ChipValue | null;
  setSelectedChip: Dispatch<SetStateAction<ChipValue | null>>;
  gameIsRunning: boolean;
  maxBetCount: number;
}) {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { roulette: rouletteAddress } = getContractAddresses(chainId);
  const { tokens } = useTokensBalances();
  const { bets, clear } = useContext(RouletteContext);
  const { activeToken, setActiveToken } = useActiveToken();
  const [formattedBalance, setFormattedBalance] = useState('0');

  const { minAmount, maxAmount } = useBetAmounts(
    activeToken?.address,
    rouletteAddress,
    rouletteBetAmountData,
  );

  const roundBet = useMemo(() => getRoundBet(bets), [bets]);

  const formattedRoundBet = useMemo(
    () => formatUnits(roundBet, 18),
    [roundBet],
  );

  const formattedMinAmount = useMemo(
    () => formatUnits(minAmount, 18),
    [minAmount],
  );

  const formattedMaxAmount = useMemo(
    () =>
      activeToken?.balance && activeToken?.balance > maxAmount
        ? formatUnits(maxAmount, 18)
        : formattedBalance,
    [activeToken?.balance, maxAmount, formattedBalance],
  );

  const ongoingGame = useRefund(rouletteAddress, 'roulette');
  const { address } = useAccount();
  const refundNeeded = useMemo(() => !!ongoingGame, [ongoingGame]);
  const refund = useRefundWrite(rouletteAddress, address);
  const onRefund = useCallback(
    async (arg: bigint) => {
      await refund({
        args: [arg],
      });
      setGameIsRunning(false);
    },
    [refund, setGameIsRunning],
  );

  useEffect(() => {
    if (!isConnected) {
      clear();
      setSelectedChip(null);
    }
  }, [clear, isConnected, setSelectedChip]);

  useEffect(() => {
    setRoundBet(roundBet);
  }, [roundBet, setRoundBet]);

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      setActiveToken(tokens[0]);
    }
  }, [setActiveToken, tokens]);

  useEffect(() => {
    setFormattedBalance(
      formatUnits(activeToken?.balance || 0n, activeToken?.decimals || 18),
    );
  }, [activeToken]);

  useEffect(() => {
    if (
      selectedChip &&
      chipValuePriceMap[selectedChip] + roundBet > (activeToken?.balance || 0n)
    ) {
      const index = chipsSequence.indexOf(selectedChip);
      setSelectedChip(index ? chipsSequence[index - 1] : null);
    }
  }, [roundBet, selectedChip, activeToken?.balance, setSelectedChip]);

  const handleChipClick = (value: ChipValue) => {
    setSelectedChip((prev) => (prev == value ? null : value));
  };

  const handleBet = () => {
    onBet(bets, roundBet);
  };

  const handleTokenChange = (symbol: string) => {
    const foundToken = tokens?.find((t) => t.symbol == symbol);
    setActiveToken(foundToken ?? null);
    clear();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* <GameModeSelector mode={mode} setMode={setMode} /> */}

      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#8C98A9]">Chip Value</p>
        <div className="flex flex-wrap gap-1 rounded-[32px] bg-[#161928] p-2">
          {rouletteChipsConfig.map(({ label, fill }) => {
            const isNotEnoughBalance =
              chipValuePriceMap[label] + roundBet >
              (activeToken?.balance || 0n);
            const isMaxAmount = chipValuePriceMap[label] + roundBet > maxAmount;
            const chipDisabled = isNotEnoughBalance || isMaxAmount;
            const getTooltipText = () => {
              if (!isConnected) {
                return 'Connect your wallet for the game';
              }

              if (isMaxAmount) {
                return `Max bet ${formatWithComma(+formattedMaxAmount)} ${activeToken?.symbol}`;
              }

              if (isNotEnoughBalance) {
                return 'Top up your balance';
              }

              return '';
            };

            const tooltipText = getTooltipText();

            return (
              <TooltipProvider key={label} delayDuration={250}>
                <Tooltip>
                  <TooltipTrigger className="flex flex-col items-center justify-center">
                    <div
                      data-cy={'chip' + label}
                      onClick={() => handleChipClick(label)}
                      className={cn(
                        'relative flex min-w-[44px] items-center justify-center rounded-full border-[3px] border-transparent',
                        selectedChip == label ? 'border-[#9747ff]' : '',
                        chipDisabled ? 'pointer-events-none opacity-70' : '',
                      )}
                    >
                      <Chip fill={fill} />
                      <span className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-40%] text-sm font-bold leading-[12px] text-[#070513]">
                        {label}
                      </span>
                    </div>
                  </TooltipTrigger>
                  {tooltipText && (
                    <TooltipContent className="bg-white text-[#070513]">
                      {tooltipText}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="text-sm text-[#8C98A9]">Bet amount</p>
          <p className="text-sm text-text">
            {formatWithComma(+formattedBalance)} {activeToken?.symbol}
          </p>
        </div>
        <div className="flex gap-4 rounded-[34px] bg-[#161928] px-4 py-2">
          <TokenSelect
            tokens={tokens}
            activeToken={activeToken}
            onTokenChange={handleTokenChange}
          />
          <input
            readOnly
            value={formattedRoundBet}
            className="bet-input w-3/5 bg-[#161928] outline-none"
            type="string"
            placeholder="0"
            data-cy="betAmountInput"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-1">
          <p className="text-sm text-[#8C98A9]">Min bet</p>
          <p className="text-sm text-text" data-cy="rltMinBetValue">
            {formatWithComma(+formattedMinAmount)} {activeToken?.symbol}
          </p>
        </div>
        <div className="flex gap-1">
          <p className="text-sm text-[#8C98A9]">Max available bet</p>
          <p className="text-sm text-text" data-cy="rltMaxBetValue">
            {formatWithComma(+formattedMaxAmount)} {activeToken?.symbol}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox.Root
          className="h-4 w-4 rounded-[4px] border border-[#D0D5DD]"
          checked={multibetEnabled}
          onCheckedChange={setMultibetEnabled}
          id="c1"
        >
          <Checkbox.Indicator className="flex items-center justify-center">
            <CheckIcon className="h-full w-full" />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <label
          htmlFor="terms"
          className="cursor-pointer text-sm font-medium leading-6 text-text peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          onClick={() => setMultibetEnabled((prev) => !prev)}
        >
          Repeat previous Bet
        </label>
      </div>
      {multibetEnabled && (
        <AutobetInput
          numOfBets={numOfBets}
          setNumOfBets={setNumOfBets}
          maxBetCount={maxBetCount}
        />
      )}
      <RecentWin recentWin={recentWin} />
      <BetButton
        className="-order-1 1.5xl:order-none"
        betAmount={betAmount.toString()}
        gameIsRunning={gameIsRunning}
        minAmount={minAmount}
        onBet={handleBet}
        refundNeeded={refundNeeded}
        onRefund={onRefund}
        ongoingGame={ongoingGame}
        disabled={
          gameIsRunning ||
          bets.size < 1 ||
          betAmount / BigInt(numOfBets) < minAmount ||
          betAmount / BigInt(numOfBets) > maxAmount
        }
      />
      <TransactionInProgress
        gameAddress={rouletteAddress}
        className="-order-1 1.5xl:order-none"
      />
    </div>
  );
}
