import BambooSvg from '@/components/ui/svg/bamboo.svg';
import { slotsVariants } from '@/constants/slots';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

import './styles.css';

export default function SlotMachine({
  slotsState,
  roundIsRunning,
}: {
  slotsState: number[][];
  roundIsRunning: boolean;
}) {
  const isMediumScreen = useMediaQuery('(max-width: 1024px)');
  return (
    <div className="flex h-[500px] w-full items-center justify-center xl:h-[653px] ">
      <div className="relative grid grid-cols-5 gap-1 md:gap-4">
        <img
          className="absolute -left-12 -top-10 w-[145px] rotate-180"
          src={BambooSvg}
          alt="bamboo-image"
        />
        {slotsState.map((row, index) => (
          <div
            key={index}
            className="slots-row z-20 max-h-[278px] overflow-hidden rounded-[16px] border-[3px] border-[#272B3F] bg-[#272b3f] md:max-h-[300px] md:border-[6px] md:p-3 lg:max-h-[388px]"
          >
            <div
              className="flex flex-col gap-2 lg:gap-6"
              style={{
                transition: roundIsRunning
                  ? `transform ${
                      5 + index * 0.75
                    }s cubic-bezier(0.33, 1, 0.68, 1) ${index * 0.075}s`
                  : '',
                transform:
                  roundIsRunning && row.length !== 4
                    ? `translateY(-${
                        (isMediumScreen ? 70 : 94) *
                        (slotsState[index].length - 4)
                      }px)`
                    : 'translateY(0px)',
              }}
            >
              {row.map((cell, index) => (
                <div
                  key={index}
                  className={cn(
                    'box-content flex max-h-14 min-h-14 min-w-14 max-w-14 items-center justify-center rounded-[13px] border-[3px] border-transparent transition-all lg:max-h-16 lg:min-h-16 lg:min-w-16 lg:max-w-16',
                    !roundIsRunning && Math.abs(cell) !== cell
                      ? 'border-[#CDACF9]'
                      : '',
                  )}
                >
                  <div className="flex max-h-12 min-h-12 min-w-12 max-w-12 flex-1 items-center justify-center lg:max-h-14 lg:min-h-14 lg:min-w-14 lg:max-w-14">
                    <img
                      className="max-h-14 w-full"
                      src={slotsVariants.get(Math.abs(cell))}
                      alt="slot-img"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <img
          className="absolute -bottom-10 -right-12 w-[145px]"
          src={BambooSvg}
          alt="bamboo-image"
        />
      </div>
    </div>
  );
}
