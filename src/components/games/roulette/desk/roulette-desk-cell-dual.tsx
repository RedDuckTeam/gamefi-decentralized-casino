import { type Dispatch, memo, type SetStateAction } from 'react';

import Chip from '@/components/ui/chip';
import { rouletteChipsConfig } from '@/constants/roulette';
import { formatTotalBet } from '@/lib/parseRouletteBets';
import { cn } from '@/lib/utils';
import { type ChipValue } from '@/types/roulette';

const RouletteDeskCellDual = memo(
  ({
    value,
    onClick,
    setHoveredRange,
    chips,
  }: {
    value: string;
    onClick: () => void;
    setHoveredRange: Dispatch<SetStateAction<string[]>>;
    chips: ChipValue[];
  }) => {
    const [a, b] = value
      .split('_')
      .map((x) => x.slice(1))
      .map(Number);
    let isVertical = Math.abs(a - b) == 1;

    if (value == 'c0_c1') {
      isVertical = false;
    }

    const handleMouseEnter = () => {
      setHoveredRange(value.replace(/[a-zA-Z]/g, '').split('_'));
    };

    const handleMouseLeave = () => {
      setHoveredRange([]);
    };

    return (
      <button
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(value, 'relative flex items-center justify-center')}
      >
        {chips?.length
          ? chips.map((chip, index) => {
              const foundChip = rouletteChipsConfig.find(
                (e) => e.label == chip,
              );

              return (
                <div
                  key={chip + index}
                  className={cn(
                    'absolute left-0 top-0 z-20 flex items-center justify-center rounded-full border-[3px] border-transparent',
                    isVertical
                      ? 'translate-x-[7px] translate-y-[-45%]'
                      : 'translate-x-[-45%] translate-y-[7px]',
                  )}
                  style={{
                    left: `${index * 3}px`,
                  }}
                >
                  <Chip fill={foundChip?.fill} size="small" />
                  {index == chips.length - 1 ? (
                    <p className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-[10px] font-medium leading-[14px] text-black">
                      {formatTotalBet(chips)}
                    </p>
                  ) : null}
                </div>
              );
            })
          : null}
      </button>
    );
  },
);

export default RouletteDeskCellDual;
RouletteDeskCellDual.displayName = 'RouletteDeskCellDual';
