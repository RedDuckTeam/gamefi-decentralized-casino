import { useMemo } from 'react';

import SlideCard from './slide-card';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useWidth } from '@/hooks/useWidth';
import { cn } from '@/lib/utils';
import { type SlideHistory } from '@/pages/slide';

import './styles.css';

export default function SlideGame({
  cards,
  innitialSize,
  roundIsRunning,
  recentWins,
  recentResult,
}: {
  cards: number[];
  innitialSize: number;
  roundIsRunning: boolean;
  recentWins: SlideHistory[];
  recentResult: boolean | null;
}) {
  const [ref, wrapperWidth] = useWidth<HTMLDivElement>();
  const isExtraSmall = useMediaQuery('(max-width: 460px');
  const isSmall = useMediaQuery('(max-width: 640px');
  const isMedium = useMediaQuery('(max-width: 768px');
  const isLarge = useMediaQuery('(max-width: 1024px');

  const numOfCards = useMemo(
    () => (isExtraSmall ? 2 : isSmall ? 3 : isMedium ? 4 : isLarge ? 5 : 6),
    [isExtraSmall, isSmall, isMedium, isLarge],
  );

  const helper = useMemo(
    () =>
      isExtraSmall ? 2.5 : isSmall ? 2 : isMedium ? 1.5 : isLarge ? 1 : 0.5,
    [isExtraSmall, isSmall, isMedium, isLarge],
  );

  const width = useMemo(
    () => (wrapperWidth ? (wrapperWidth - 8 * numOfCards) / numOfCards : 0),
    [numOfCards, wrapperWidth],
  );

  const selectColor =
    roundIsRunning || recentResult === null
      ? 'rgba(131,138,147,0.6)'
      : recentResult
        ? '#14be7d'
        : '#ab2e53';

  return (
    <div className="grid h-[525px] 2xl:h-full">
      <div className="relative h-full w-full overflow-hidden rounded-[18px]">
        <img
          src="/images/pages/slide/game-bg.webp"
          className="image-container"
          alt="bg"
        />
        <div className="absolute right-5 top-5 flex gap-1">
          {recentWins.map(({ state, result }, index) => (
            <div
              key={index}
              className={cn(
                'rounded-[16px] px-3 py-[6px]',
                state ? 'bg-[#14be7d]' : 'bg-[#ab2e53]',
              )}
            >
              {result}
            </div>
          ))}
        </div>
        <div className="content-container">
          <div ref={ref} className="overflow-hidden">
            <div
              className="absolute bottom-[50%] flex gap-2"
              style={{
                transition: roundIsRunning
                  ? 'transform 10s cubic-bezier(0.33, 1, 0.68, 1)'
                  : '',
                left: width
                  ? `-${(width + 8) * (innitialSize - numOfCards - helper) - 4}px`
                  : '',
                transform: roundIsRunning
                  ? `translateY(50%) translateX(-${
                      (width + 8) * innitialSize
                    }px)`
                  : 'translateY(50%)',
              }}
            >
              {width &&
                cards.map((value, index) => (
                  <SlideCard width={width} key={index} value={value} />
                ))}
            </div>
            <div className="absolute bottom-36 left-[50%] flex -translate-x-[50%] translate-y-[50%] flex-col gap-[3px] 2xl:bottom-28">
              <div
                className={cn(
                  'h-20 w-3 rounded-[7px] transition-colors',
                  `bg-[${selectColor}]`,
                )}
              />
              <div
                className={cn(
                  'h-3 w-3 rounded-full transition-colors',
                  `bg-[${selectColor}]`,
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
