import { memo, useEffect, useState } from 'react';

import RouletteDesk from './desk';
import styles from './roulette.module.css';

import { rouletteSpinAudio } from '@/api/sound.ts';
import { Badge } from '@/components/ui/badge';
import { BaseDialog } from '@/components/ui/base-dialog.tsx';
import { OrientationDialog } from '@/components/ui/orientation-dialog.tsx';
import RouletteCoins1Svg from '@/components/ui/svg/coins-1.svg';
import RouletteCoins2Svg from '@/components/ui/svg/coins-2.svg';
import RouletteLooserSvg from '@/components/ui/svg/roulette-loser.svg';
import RouletteWinnerSvg from '@/components/ui/svg/roulette-winner.svg';
import { rouletteNumbersWithColors } from '@/constants/roulette';
import { useIsPortrait } from '@/hooks/useIsPortrait.ts';
import { useRecentWinsStore } from '@/hooks/useRecentWinsState.ts';
import { cn } from '@/lib/utils';
import { type ChipValue } from '@/types/roulette';

const RouletteGame = memo(
  ({
    selectedNumber = -1,
    recentResult,
    betId,
    selectedChip,
  }: {
    selectedNumber: number;
    recentResult: boolean;
    betId: number | null;
    selectedChip: ChipValue | null;
  }) => {
    const segmentAngle = 360 / rouletteNumbersWithColors.length;

    const [rotation, setRotation] = useState(90);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSpinActive, setIsSpinActive] = useState(false);
    const [isOrientationDialog, setOrientationDialog] = useState(false);
    const [isTableDialog, setTableDialog] = useState(false);
    const { rouletteRecentWins, setRouletteRecentWins, getRouletteRecentWins } =
      useRecentWinsStore();

    const { isPortrait, size } = useIsPortrait();
    const width = size[0];

    useEffect(() => {
      if (isSpinActive && width < 1024) {
        setTableDialog(true);
      } else {
        setTimeout(() => setTableDialog(false), 3000);
      }
    }, [isSpinActive, width]);

    useEffect(() => {
      if (isPortrait) {
        setOrientationDialog(true);
      }
    }, [isPortrait]);

    useEffect(() => {
      if (selectedNumber === -1) return;

      setIsSpinActive(true);

      const targetIndex = rouletteNumbersWithColors.findIndex(
        ({ number }) => number === selectedNumber,
      );
      const segmentCount = rouletteNumbersWithColors.length;

      const indexDifference = segmentCount - targetIndex + currentIndex;

      const extraRotations = Math.floor(Math.random() * 3) + 3;
      const newRotation = 360 * extraRotations + indexDifference * segmentAngle;

      const onRotation = setTimeout(() => {
        setRotation((prevRotation) => {
          const finalRotation = prevRotation + newRotation;
          setCurrentIndex(targetIndex);
          return finalRotation;
        });
        rouletteSpinAudio.play();
      }, 1000);

      const onSpinEnd = setTimeout(() => {
        const prevWins = getRouletteRecentWins();

        const currentWin = rouletteNumbersWithColors.find(
          ({ number }) => number === selectedNumber,
        );

        if (!currentWin) return prevWins;

        const newWins = [...prevWins, currentWin];
        setRouletteRecentWins(newWins.length > 4 ? newWins.slice(-4) : newWins);

        setIsSpinActive(false);
      }, 10.5 * 1000);

      return () => {
        clearTimeout(onSpinEnd);
        clearTimeout(onRotation);
      };

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNumber, segmentAngle, betId]);

    const tableElement = (
      <div className="pointer-events-none relative h-[350px] w-full">
        <div className="flex h-1/2 w-full -translate-y-[225px] items-center justify-center">
          {recentResult ? (
            <img
              className={cn(
                'absolute bottom-0 left-[50%] z-20 -translate-x-[52%] translate-y-[253%] -rotate-[3deg] scale-90 transition-all duration-300',
                isSpinActive ? 'opacity-0' : 'opacity-100',
              )}
              src={RouletteWinnerSvg}
              alt="winner"
            />
          ) : (
            <img
              className={cn(
                'absolute bottom-0 left-[50%] z-20 -translate-x-[52%] translate-y-[253%] -rotate-[3deg] scale-90 transition-all duration-300',
                isSpinActive ? 'opacity-0' : 'opacity-100',
              )}
              src={RouletteLooserSvg}
              alt="lose"
            />
          )}

          <div className="relative">
            <img
              className={cn(
                'absolute bottom-[10px] left-[18%] z-20',
                isSpinActive ? 'opacity-0' : 'opacity-100',
              )}
              src={RouletteCoins1Svg}
              alt="coins-image-1"
            />
            <img
              className={cn(
                'absolute bottom-[105px] right-[4%] z-20',
                isSpinActive ? 'opacity-0' : 'opacity-100',
              )}
              src={RouletteCoins2Svg}
              alt="coins-image-2"
            />
            <div
              className={styles.wheel}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {rouletteNumbersWithColors.map(({ number, color }, index) => (
                <div
                  key={number}
                  className={cn(styles.segment, 'flex flex-col gap-2')}
                  style={{
                    transform: `rotate(${
                      index * segmentAngle
                    }deg) translate(340px, -50%) rotate(90deg)`,
                    background:
                      color === 'green'
                        ? '#14be7d'
                        : color === 'red'
                          ? '#9747ff'
                          : '#272b3f',
                  }}
                >
                  <div className="-scale-[1] pb-1 text-lg font-semibold text-text">
                    {number}
                  </div>
                  <div className="h-1/2 w-full bg-black opacity-35" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[18px] bg-gradient-to-b from-transparent to-[#070513]">
        <div className="sm:h-0 md:h-[32px] lg:h-0" />

        <img
          src="/images/pages/roulette/game-bg.webp"
          alt="roulette-bg"
          className="pointer-events-none absolute h-full w-full object-cover opacity-65 mix-blend-color-dodge"
        />
        <img
          src="/images/pages/roulette/wheel-lever.webp"
          alt="roulette-lever"
          className="pointer-events-none absolute -top-[55px] w-full scale-[0.62] opacity-65"
        />

        {/*desktop version tableElement*/}
        <div className="hidden lg:block">{tableElement}</div>

        {/*mobile version tableElement*/}
        <BaseDialog open={isTableDialog} setOpen={setTableDialog}>
          <div className="h-[200px] w-[350px] flex-col items-center justify-center">
            <div className="scale-[60%]">{tableElement}</div>
          </div>
        </BaseDialog>

        <div className="pointer-events-none absolute left-0 top-[8%] flex w-full justify-center">
          <div data-cy="rltWinNumber" className="flex gap-1">
            {rouletteRecentWins.map(({ color, number }, index) => (
              <Badge key={index} variant={color}>
                {number}
              </Badge>
            ))}
          </div>
        </div>

        <OrientationDialog
          open={isOrientationDialog}
          setOpen={setOrientationDialog}
        />

        {/*desktop version RouletteDesk*/}
        <div className="hidden h-[320px] w-full items-center justify-center xs:grid sm:h-[340px] md:mb-4 md:h-auto">
          <div className="w-[800px] scale-[65%] sm:scale-[74%] md:scale-[90%] lg:scale-100">
            <RouletteDesk selectedChip={selectedChip} />
          </div>
        </div>

        {/*mobile version RouletteDesk*/}
        <div className="mt-[50px] grid h-[650px] w-full items-center justify-center xs:hidden">
          <div className="w-[800px] rotate-90 scale-[70%]">
            <RouletteDesk selectedChip={selectedChip} />
          </div>
        </div>
      </div>
    );
  },
);

export default RouletteGame;
RouletteGame.displayName = 'RouletteGame';
