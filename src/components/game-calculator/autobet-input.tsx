import {
  type ChangeEvent,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from 'react';

import Minus from '@/components/ui/svg/minus.svg';
import Plus from '@/components/ui/svg/plus.svg';
import { cn } from '@/lib/utils';

export default function AutobetInput({
  numOfBets,
  setNumOfBets,
  disabled = false,
  maxBetCount = 100,
}: {
  numOfBets: number;
  setNumOfBets: Dispatch<SetStateAction<number>>;
  disabled?: boolean;
  maxBetCount?: number;
}) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let parsedValue = parseInt(e.target.value, 10);
    if (isNaN(parsedValue)) {
      parsedValue = 1;
    } else {
      parsedValue = Math.max(1, Math.min(parsedValue, maxBetCount));
    }
    setNumOfBets(parsedValue);
  };

  const handleIncrement = useCallback(() => {
    setNumOfBets((prev) => (prev < maxBetCount ? prev + 1 : prev));
  }, [maxBetCount, setNumOfBets]);

  const handleDecrement = useCallback(() => {
    setNumOfBets((prev) => (prev > 1 ? prev - 1 : prev));
  }, [setNumOfBets]);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-[#8C98A9]">Number of bets</p>
      <div className="flex justify-between gap-4 rounded-[34px] bg-[#161928] px-4 py-2">
        <input
          value={numOfBets}
          disabled={disabled}
          onChange={handleInputChange}
          className={cn(
            'bet-input w-3/5 bg-[#161928] outline-none',
            disabled ? 'opacity-65' : '',
          )}
          type="string"
          placeholder="0"
        />
        <div
          className={cn(
            'flex items-center gap-1',
            disabled ? 'opacity-65' : '',
          )}
        >
          <button
            disabled={disabled || numOfBets == 1}
            className={cn(
              'transition-opacity',
              disabled || numOfBets == 1 ? 'opacity-60' : '',
            )}
            onClick={handleDecrement}
          >
            <img className="h-5 min-w-5" src={Minus} alt="-" />
          </button>
          <button
            disabled={disabled}
            className={cn(
              'transition-opacity',
              disabled || numOfBets == maxBetCount ? 'opacity-60' : '',
            )}
            onClick={handleIncrement}
          >
            <img className="h-5 min-w-5" src={Plus} alt="+" />
          </button>
        </div>
      </div>
    </div>
  );
}
