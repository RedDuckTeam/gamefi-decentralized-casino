import {
  type Dispatch,
  type SetStateAction,
  memo,
  type ReactNode,
} from 'react';
import { useAccount } from 'wagmi';

import Chip from '@/components/ui/chip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { rouletteChipsConfig } from '@/constants/roulette';
import {
  ROULETTE_NUMBERS_SEQUENCE,
  blackNumbers,
  botNumbers,
  evenNumbers,
  midNumbers,
  oddNumbers,
  redNumbers,
  topNumbers,
} from '@/constants/roulette-numbers';
import { formatTotalBet } from '@/lib/parseRouletteBets';
import { cn } from '@/lib/utils';
import { type ChipValue } from '@/types/roulette';

const RouletteDeskCell = memo(
  ({
    value,
    variant = 'black',
    label,
    className,
    onClick,
    setHoveredRange,
    chips,
    hovered,
    chipSelected,
  }: {
    value: string;
    variant?: 'red' | 'black' | 'zero' | 'custom';
    label?: ReactNode;
    className?: string;
    onClick: () => void;
    setHoveredRange: Dispatch<SetStateAction<string[]>>;
    chips?: ChipValue[];
    hovered: boolean;
    chipSelected: boolean;
  }) => {
    const { isConnected } = useAccount();

    const handleMouseEnter = () => {
      if (value.includes('_')) return;

      if (value.includes('-')) {
        const matches = value.match(/(\d+)-(\d+)/);

        if (!matches) throw new Error('Invalid input format');

        const start = parseInt(matches[1], 10);
        const end = parseInt(matches[2], 10);

        const range: string[] = [];
        for (let i = start; i <= end; i++) {
          range.push(String(i));
        }

        return setHoveredRange(range);
      }

      if (value == 'red') return setHoveredRange(redNumbers);
      if (value == 'black') return setHoveredRange(blackNumbers);

      if (value == 'ctop') return setHoveredRange(topNumbers);
      if (value == 'cmid') return setHoveredRange(midNumbers);
      if (value == 'cbot') return setHoveredRange(botNumbers);

      if (value == 'even') return setHoveredRange(evenNumbers);
      if (value == 'odd') return setHoveredRange(oddNumbers);
    };

    const handleMouseLeave = () => {
      setHoveredRange([]);
    };

    const isSimpleCell = value.match(/\bc\d{1,2}(?!\d|[-_])/g);

    const getTooltipText = () => {
      if (!isConnected) {
        return 'Connect wallet to place a bet.';
      }

      if (!chipSelected) {
        return 'Select a chip to place a bet.';
      }

      return '';
    };

    const tooltipText = getTooltipText();

    return (
      <TooltipProvider delayDuration={250} disableHoverableContent>
        <Tooltip>
          <TooltipTrigger
            className={cn(
              value,
              ROULETTE_NUMBERS_SEQUENCE.includes(+value.slice(1)) &&
                value !== 'c0'
                ? 'group'
                : '',
              'relative flex min-h-[42px] items-center justify-center rounded-[12px] border border-[#272B3F] bg-[#272B3F] transition-colors',
              variant == 'red'
                ? 'border-[#9747FF] bg-[rgba(115,23,234,0.14)] hover:bg-[#9747FF]'
                : '',
              variant == 'black'
                ? 'border-[#272B3F] bg-[#272B3F] hover:bg-[#52566a]'
                : '',
              variant == 'zero'
                ? 'border-[#14BE7D] bg-[rgba(20,190,125,0.14)] hover:bg-[#14BE7D]'
                : '',
              variant == 'custom'
                ? 'border-[#363C5B] bg-[#363C5B] hover:bg-[#494f70]'
                : '',
              className,
              hovered && variant == 'red'
                ? 'bg-[#9747ff]'
                : hovered && variant == 'black'
                  ? 'bg-[#52566a]'
                  : hovered && variant == 'zero'
                    ? 'bg-[#14BE7D]'
                    : '',
            )}
          >
            <div
              onClick={onClick}
              onMouseEnter={!isSimpleCell ? handleMouseEnter : undefined}
              onMouseLeave={!isSimpleCell ? handleMouseLeave : undefined}
              className="flex h-full w-full items-center justify-center"
            >
              {chips?.map((chip, index) => (
                <div
                  key={chip + index}
                  className="absolute left-0 top-[50%] z-20 flex translate-x-[5px] translate-y-[-50%] items-center justify-center rounded-full border-[3px] border-transparent group-hover:opacity-40"
                  style={{
                    left: `${index * 3}px`,
                  }}
                >
                  <Chip
                    fill={
                      rouletteChipsConfig.find((c) => c.label == chip)?.fill
                    }
                    size="small"
                  />
                  {index == chips.length - 1 ? (
                    <p className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-[10px] font-medium leading-[14px] text-black group-hover:hidden">
                      {formatTotalBet(chips)}
                    </p>
                  ) : null}
                </div>
              ))}

              {!value.includes('_') || chips?.length == 0 ? (
                <div data-cy={label} className="text-sm text-text">
                  {label || value}
                </div>
              ) : null}
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
  },
);

export default RouletteDeskCell;
