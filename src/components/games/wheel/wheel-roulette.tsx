import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import WheelLose from '@/components/ui/svg/wheel-lose.svg';
import WheelSuccess from '@/components/ui/svg/wheel-success.svg';
import {
  type WheelRisk,
  wheelData as rawWheelData,
  wheelImageMap,
  type WheelVariant,
} from '@/constants/wheel';
import './styles.css';
import { useRecentWinsStore } from '@/hooks/useRecentWinsState.ts';

interface WheelRouletteProps {
  selectedRisks: WheelRisk;
  selectedVariant: WheelVariant | null;
  betId: number;
  localBetId: number;
  isWin: boolean | null;
}

export default function WheelRoulette({
  selectedRisks,
  selectedVariant,
  betId,
  localBetId,
  isWin,
}: WheelRouletteProps) {
  const wheelData = rawWheelData[selectedRisks];
  const segmentAngle = 360 / wheelData.length;

  const [rotation, setRotation] = useState(90);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { wheelRecentWins, getWheelRecentWins, setWheelRecentWins } =
    useRecentWinsStore();

  useEffect(() => {
    if (!selectedVariant) return;

    const indices = wheelData.reduce((acc: number[], variant, index) => {
      if (variant === selectedVariant) {
        acc.push(index);
      }
      return acc;
    }, []);

    const targetIndex = indices[Math.floor(Math.random() * indices.length)];

    const segmentCount = wheelData.length;
    const indexDifference = segmentCount - targetIndex + currentIndex;
    const extraRotations = Math.floor(Math.random() * 3) + 3;
    const newRotation = 360 * extraRotations + indexDifference * segmentAngle;
    setRotation((prevRotation) => {
      const finalRotation = prevRotation + newRotation;
      setCurrentIndex(targetIndex);
      return finalRotation;
    });

    const onSpinEnd = setTimeout(() => {
      const prevWins = getWheelRecentWins();
      let newWins = [...prevWins, wheelData[targetIndex]];
      if (newWins.length > 4) {
        newWins = newWins.slice(1);
      }
      setWheelRecentWins(newWins);
    }, 10 * 1000);

    return () => clearTimeout(onSpinEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariant, segmentAngle, betId, localBetId]);

  return (
    <div className="pointer-events-none absolute h-full w-[665px]  overflow-hidden">
      <div className="flex h-1/2 w-full -translate-y-[40%] items-center justify-center">
        <div className="relative overflow-hidden rounded-full  ">
          <div className="absolute bottom-[37%] left-0 flex w-full justify-center">
            <div className="flex gap-1">
              {wheelRecentWins.map((recentWin, index) => (
                <Badge key={index} variant={recentWin}>
                  {recentWin}
                </Badge>
              ))}
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 h-[435px] w-[435px] -translate-x-1/2 -translate-y-1/2 rounded-full  shadow-[0_0_0_99999px_rgba(14,15,29,1)]"></div>

          <img
            src={WheelSuccess}
            alt="Success"
            className={`absolute -bottom-1 left-1/2  z-20 w-[120px] -translate-x-1/2 transition-all duration-300 ${
              isWin === true ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <img
            src={WheelLose}
            alt="Lose"
            className={`absolute -bottom-1 left-1/2  z-20 w-[120px] -translate-x-1/2 transition-all duration-300 ${
              isWin === false ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div
            className="wheel"
            style={{ transform: `rotate(${rotation + 7}deg)` }}
          >
            {wheelData.map((variant, index) => (
              <img
                key={index}
                style={{
                  transform: `rotate(${
                    index * segmentAngle
                  }deg) translate(333px, -50%) rotate(86deg)`,
                }}
                className="segment z-10"
                src={wheelImageMap[variant]}
                alt="segment"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
