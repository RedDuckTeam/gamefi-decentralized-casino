import { useEffect, useRef, useState } from 'react';

type Props = {
  movingTimeout?: number;
  orientation?: 'vertical' | 'horizontal';
  gameIsRunning: boolean;
};

export const Ruler = ({
  movingTimeout = 4000,
  orientation = 'vertical',
  gameIsRunning,
}: Props) => {
  const isVertical = orientation === 'vertical';
  const configBubles = Array.from({ length: isVertical ? 5 : 1 }, () => '');
  // Fill dots
  const [multipliers, setMultipliers] = useState(
    Array.from({ length: 7 }, (_, index) =>
      isVertical ? parseFloat((1 + index * 0.4).toFixed(1)) : 2 + index * 2,
    ),
  );
  const [transition, setTransition] = useState(isVertical ? 16 : -32);

  const rulerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameIsRunning) {
      // Handle dots adding
      const startElemsInterval = setInterval(() => {
        setMultipliers((prevMultipliers) => [
          ...prevMultipliers,
          parseFloat(
            (
              prevMultipliers[prevMultipliers.length - 1] +
              (isVertical ? 0.4 : 2)
            ).toFixed(1),
          ),
        ]);
      }, 300);

      return () => {
        clearInterval(startElemsInterval);
      };
    } else {
      setTimeout(() => {
        if (rulerRef.current) {
          rulerRef.current.style.transitionDuration = '0s';
          //Return to start on game end
          setTransition(isVertical ? 16 : -32);
          setTimeout(() => {
            if (rulerRef.current) {
              rulerRef.current.style.transitionDuration = '1s';
            }
          }, 200);
        }
      }, 4 * 1000);
    }
  }, [gameIsRunning, isVertical, multipliers]);

  useEffect(() => {
    let createMovingInterval: NodeJS.Timeout;
    let createTransitionInterval: NodeJS.Timeout;

    if (gameIsRunning) {
      const startTime = Date.now();
      let time_elapsed = (Date.now() - startTime) / 1000.0;

      let multiplier = 0;

      // Handle dots transition
      createTransitionInterval = setInterval(() => {
        // Transition delay

        createMovingInterval = setTimeout(
          () => {
            time_elapsed = (Date.now() - startTime) / 1000.0;
            multiplier = isVertical ? 0.85 * Math.pow(1.03, time_elapsed) : 7.4;
          },
          isVertical ? 22 * 1000 : 0,
        );
        setTransition((prevTransition) => prevTransition - multiplier);
      }, 100);

      return () => {
        // Return transition to 0
        clearInterval(createTransitionInterval);
        clearTimeout(createMovingInterval);
        setTimeout(() => {
          setTransition(isVertical ? 16 : -32);
          setMultipliers(
            Array.from({ length: 7 }, (_, index) =>
              isVertical
                ? parseFloat((1 + index * 0.4).toFixed(1))
                : 2 + index * 2,
            ),
          );
        }, 4 * 1000);
      };
    }

    return () => {
      clearTimeout(createMovingInterval);
      clearInterval(createTransitionInterval);
    };
  }, [gameIsRunning, isVertical, movingTimeout]);

  return isVertical ? (
    <div
      ref={rulerRef}
      className={`absolute flex flex-col-reverse `}
      style={{
        bottom: transition + 'px',
        transition: 'bottom 1s ease-out',
      }}
    >
      {multipliers.map((item, i) => (
        <div key={i}>
          <div className="flex flex-col gap-[11px]">
            {configBubles.map(
              (_, index) =>
                i !== multipliers.length - 1 && (
                  <div
                    key={index}
                    className="ml-[1px] h-1.5 w-1.5 rounded-full bg-[#838092]"
                  />
                ),
            )}
          </div>
          <div className="my-1 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-white" />
            <div>{item}x</div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div
      ref={rulerRef}
      className={`absolute bottom-4 flex flex-row `}
      style={{
        left: transition + 'px',
        transition: 'left 0.1s ease-out',
      }}
    >
      {multipliers.map((item, i) => (
        <div key={i} className="flex  flex-row-reverse items-end">
          <div className="flex  gap-[11px]">
            {configBubles.map(
              (_, index) =>
                i !== multipliers.length - 1 && (
                  <div
                    key={index}
                    className="h-1.5 w-1.5 rounded-full bg-[#838092]"
                  />
                ),
            )}
          </div>
          <div className="flex w-44 flex-col-reverse items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-white" />
            <div>{item}s</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Ruler;
