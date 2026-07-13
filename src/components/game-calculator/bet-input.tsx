import {
  type ChangeEvent,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
  useMemo,
} from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount } from 'wagmi';

import AutobetInput from './autobet-input';
import { GameMode } from './mode-selector';
import TokenSelect from './token-select';

import Minus from '@/components/ui/svg/minus.svg';
import Plus from '@/components/ui/svg/plus.svg';
import { useActiveToken } from '@/hooks/useActiveToken';
import { useTokensBalances } from '@/hooks/useTokensBalances';
import { maxValueChecker } from '@/lib/max-value-checker';
import { cn, formatWithComma } from '@/lib/utils';

export default function BetCalculator({
  minAmount,
  maxAmount,
  mode,
  betAmount,
  setBetAmount,
  numOfBets,
  setNumOfBets,
  disabled = false,
  maxBetCount = 100,
}: {
  minAmount: bigint;
  maxAmount: bigint;
  mode: GameMode;
  betAmount: string;
  setBetAmount: Dispatch<SetStateAction<string>>;
  numOfBets: number;
  setNumOfBets: Dispatch<SetStateAction<number>>;
  disabled?: boolean;
  maxBetCount?: number;
}) {
  const { isConnected } = useAccount();
  const { tokens } = useTokensBalances();
  const { activeToken, setActiveToken } = useActiveToken();

  const [formattedBalance, setFormattedBalance] = useState('0');

  const parsedBetAmount = useMemo(() => parseUnits(betAmount, 18), [betAmount]);

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

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      setActiveToken(tokens[0]);
    }
  }, [setActiveToken, tokens]);

  useEffect(() => {
    if (maxAmount && parsedBetAmount > maxAmount) {
      setBetAmount(formatUnits(maxAmount, 18));
    }
  }, [betAmount, maxAmount, parsedBetAmount, setBetAmount]);

  useEffect(() => {
    setFormattedBalance(
      formatUnits(activeToken?.balance || 0n, activeToken?.decimals || 18),
    );
    // setBetAmount('0');
  }, [activeToken, setBetAmount]);

  const handleBetInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue == '') {
      setBetAmount('');
    } else if (newValue === '.' || newValue == '0.') {
      setBetAmount('0.');
    } else if (
      newValue.startsWith('.') ||
      (newValue.startsWith('0') && !newValue.startsWith('0.'))
    ) {
      setBetAmount(String(parseFloat(newValue)));
    } else if (/^\d*\.?\d*$/.test(newValue)) {
      setBetAmount(maxValueChecker(newValue, formattedMaxAmount));
    }
  };

  const handleDecrement = () => {
    if (betAmount == '') return setBetAmount('0');
    let [integerPart, fractionalPart] = betAmount.split('.');

    if (fractionalPart) {
      if (fractionalPart !== '0'.repeat(fractionalPart.length)) {
        const decrementedFractional = (BigInt(fractionalPart) - 1n)
          .toString()
          .padStart(fractionalPart.length, '0');

        fractionalPart = decrementedFractional;
      } else {
        integerPart = (BigInt(integerPart) - 1n).toString();
        fractionalPart = '9'.repeat(fractionalPart.length);
      }
    } else {
      integerPart = (BigInt(integerPart) - 1n).toString();
    }

    if (parseInt(integerPart, 10) < 0) {
      integerPart = '0';
      fractionalPart = fractionalPart ? '0'.repeat(fractionalPart.length) : '';
    }

    setBetAmount(`${integerPart}${fractionalPart ? '.' + fractionalPart : ''}`);
  };

  const handleIncrement = () => {
    if (betAmount == '')
      return setBetAmount(maxValueChecker('1', formattedMaxAmount));

    let [integerPart, fractionalPart] = betAmount.split('.');

    if (fractionalPart) {
      const fractionalLength = fractionalPart.length;
      let incrementedFractional = (BigInt(fractionalPart) + 1n)
        .toString()
        .padStart(fractionalLength, '0');

      if (incrementedFractional.length > fractionalLength) {
        integerPart = (BigInt(integerPart) + 1n).toString();
        incrementedFractional = incrementedFractional.substring(1);
      }

      fractionalPart = incrementedFractional;
    } else {
      integerPart = String(parseInt(integerPart) + 1);
    }

    const resultBet =
      integerPart + `${fractionalPart ? '.' + fractionalPart : ''}`;

    setBetAmount(maxValueChecker(resultBet, formattedMaxAmount));
  };

  const handleHalf = () => {
    setBetAmount((prev) => {
      const halfedValue = parseFloat(prev) / 2;

      return String(
        halfedValue > parseFloat(formattedMinAmount)
          ? halfedValue
          : formattedMinAmount,
      );
    });
  };

  const handleMin = () => {
    setBetAmount(formattedMinAmount);
  };

  const handleDouble = () => {
    setBetAmount((prev) => {
      if (prev == '' || prev == '0') return '0';

      let [integerPart, fractionalPart] = prev.split('.');

      if (!fractionalPart)
        return maxValueChecker(String(+integerPart * 2), formattedMaxAmount);

      const startingFractionalLength = fractionalPart.length;
      fractionalPart = (BigInt(fractionalPart) * 2n)
        .toString()
        .padStart(startingFractionalLength, '0');

      integerPart = String(2 * parseInt(integerPart));

      if (fractionalPart.length > startingFractionalLength) {
        integerPart = String(+integerPart + +fractionalPart[0]);
        fractionalPart = fractionalPart.slice(1);
      }

      const result =
        integerPart + `${fractionalPart ? '.' + fractionalPart : ''}`;

      return maxValueChecker(result, formattedMaxAmount);
    });
  };

  const handleTriple = () => {
    setBetAmount((prev) => {
      if (prev == '' || prev == '0') return '0';

      let [integerPart, fractionalPart] = prev.split('.');

      if (!fractionalPart)
        return maxValueChecker(String(+integerPart * 3), formattedMaxAmount);

      const startingFractionalLength = fractionalPart.length;
      fractionalPart = (BigInt(fractionalPart) * 3n)
        .toString()
        .padStart(startingFractionalLength, '0');

      integerPart = String(3 * parseInt(integerPart));

      if (fractionalPart.length > startingFractionalLength) {
        integerPart = String(+integerPart + +fractionalPart[0]);
        fractionalPart = fractionalPart.slice(1);
      }

      const result =
        integerPart + `${fractionalPart ? '.' + fractionalPart : ''}`;

      return maxValueChecker(result, formattedMaxAmount);
    });
  };

  const handleMax = () => {
    setBetAmount(formattedMaxAmount);
  };

  const handleTokenChange = (symbol: string) => {
    const foundToken = tokens?.find((t) => t.symbol == symbol);
    setActiveToken(foundToken ?? null);
  };

  const btnClassName = 'px-3 py-[6px] text-sm font-medium text-[#8C98A9]';

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        !isConnected ? 'pointer-events-none opacity-40' : '',
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="text-sm text-[#8C98A9]">Bet amount</p>
          <p className="text-sm text-text" data-cy="specifiedBetAmount">
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
            value={betAmount}
            onChange={handleBetInputChange}
            disabled={disabled}
            className={cn(
              'bet-input w-3/5 bg-[#161928] outline-none',
              disabled ? 'opacity-65' : '',
            )}
            type="string"
            placeholder="0"
            data-cy="betAmountInput"
          />
          <div className="ml-auto flex items-center gap-1">
            <button
              className="transition-opacity disabled:opacity-65"
              disabled={disabled || !betAmount || parsedBetAmount <= minAmount}
              onClick={handleDecrement}
              data-cy="betMinus"
            >
              <img className="h-5 min-w-5" src={Minus} alt="-" />
            </button>
            <button
              className="transition-opacity disabled:opacity-65"
              disabled={
                disabled ||
                !maxAmount ||
                formattedMaxAmount === '0' ||
                parsedBetAmount >= maxAmount
              }
              onClick={handleIncrement}
              data-cy="betPlus"
            >
              <img className="h-5 min-w-5" src={Plus} alt="+" />
            </button>
          </div>
        </div>
        <div className="flex">
          <button
            onClick={handleHalf}
            className={btnClassName}
            data-cy="halfedBetAmount"
          >
            1/2
          </button>
          <button
            onClick={handleMin}
            className={btnClassName}
            data-cy="minBetAmount"
          >
            min
          </button>
          <button
            onClick={handleDouble}
            className={btnClassName}
            data-cy="doubledBetAmount"
          >
            2x
          </button>
          <button
            onClick={handleTriple}
            className={btnClassName}
            data-cy="trippledBetAmount"
          >
            3x
          </button>
          <button
            onClick={handleMax}
            className={btnClassName}
            data-cy="maxBetAmount"
          >
            max
          </button>
        </div>
      </div>
      {mode == GameMode.Auto ? (
        <AutobetInput
          disabled={disabled}
          numOfBets={numOfBets}
          setNumOfBets={setNumOfBets}
          maxBetCount={maxBetCount}
        />
      ) : null}
    </div>
  );
}
