import runningMan from '/games/limbo-running.gif';

import LimboMultiplier from './limbo-multiplier';
import { type LimboMultiplierProps } from './limbo-multiplier';

import { Badge } from '@/components/ui/badge';
import MinusSvg from '@/components/ui/svg/minus-multiplier.svg';
import PlusSvg from '@/components/ui/svg/plus-multiplier.svg';
import {
  MAX_TARGET_COEFFICIENT,
  MIN_TARGET_COEFFICIENT,
} from '@/constants/limbo';
import { useCoeffInput } from '@/hooks/useCoeffInput';
import { getValueWithComa } from '@/lib/getValueWithComa';
import { cn } from '@/lib/utils';
import { type ILimboPreviousBet } from '@/pages/limbo';

interface LimboGameProps {
  targetCoeff: string;
  setTargetCoeff: (value: string) => void;
  previousBets: ILimboPreviousBet[];
  gameIsRunning: boolean;
}

export default function LimboGame({
  targetCoeff,
  setTargetCoeff,
  isLose,
  isWin,
  liveMultiplier,
  previousBets,
  gameIsRunning,
}: LimboGameProps & LimboMultiplierProps) {
  const { handleInputChange, handleDecrement, handleIncrement } = useCoeffInput(
    {
      minCoeff: MIN_TARGET_COEFFICIENT,
      maxCoeff: MAX_TARGET_COEFFICIENT,
      value: targetCoeff,
      setValue: setTargetCoeff,
    },
  );

  return (
    <div className="flex h-[535px] items-center  justify-center rounded-[18px] bg-[url('/games/limbo-game-bg.png')] bg-cover bg-[0%_50%] text-4xl font-bold md:h-[635px]">
      <div className="flex h-full w-full flex-col items-center justify-between p-3">
        <div
          data-cy="limboGameResult"
          className=" flex h-9 w-full justify-end gap-1"
        >
          {previousBets.map((bet, i) => (
            <Badge variant={bet.result ? 'success' : 'default'} key={i}>
              {bet.multiplier}
            </Badge>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <LimboMultiplier
            isLose={isLose}
            isWin={isWin}
            liveMultiplier={liveMultiplier}
          />
          <img
            src={runningMan}
            className="w-[187px] md:w-[287px]"
            alt="running man"
          />
        </div>
        <div className="flex flex-col justify-between gap-2 p-3 md:w-full md:flex-row">
          <div
            className={cn(
              'flex items-center gap-2 rounded-[32px] bg-purple py-2 pl-4 pr-2 transition-all',
              !targetCoeff || parseFloat(targetCoeff) < MIN_TARGET_COEFFICIENT
                ? 'bg-[#9747FF99] text-[#F1F1F199]'
                : '',
            )}
          >
            <p className="text-[12px] text-text">Target Coefficient</p>
            <div className="flex items-center gap-2 rounded-[32px] bg-[#161928] px-4 py-2">
              <button
                disabled={
                  parseFloat(targetCoeff) <= MIN_TARGET_COEFFICIENT ||
                  gameIsRunning
                }
                onClick={handleDecrement}
                className="disabled:cursor-not-allowed"
                data-cy="limboTargetCoeffMinus"
              >
                <img src={MinusSvg} alt="Minus" />
              </button>
              <input
                disabled={gameIsRunning}
                onChange={handleInputChange}
                className="w-14 bg-transparent text-center text-[14px] text-text focus-visible:outline-none"
                value={targetCoeff}
                placeholder={String(MIN_TARGET_COEFFICIENT)}
                data-cy="limbotTargerCoeffInput"
              />
              <button
                disabled={gameIsRunning}
                onClick={handleIncrement}
                className="disabled:cursor-not-allowed"
                data-cy="limboTargetCoeffPlus"
              >
                <img src={PlusSvg} alt="Plus" />
              </button>
            </div>
          </div>
          <div className="flex  gap-2 rounded-[32px] bg-[#070513] p-2">
            <div className="flex flex-col justify-center gap-0.5 rounded-[32px] bg-[#161928] px-4 py-2">
              <p className="w-[108px] text-center text-[12px] leading-none text-[#8C98A9]">
                Payout
              </p>
              <p
                className="w-[108px] text-center text-[14px] leading-none text-text"
                data-cy="limboPayout"
              >
                {targetCoeff ? `x${getValueWithComa(targetCoeff)}` : '-'}
              </p>
            </div>
            <div className="flex flex-col items-stretch justify-center gap-0.5 rounded-[32px] bg-[#161928] px-4 py-2">
              <p className="w-[108px] text-center text-[12px] leading-none text-[#8C98A9]">
                Win chance
              </p>
              <p
                className="w-[108px] text-center text-[14px] leading-none text-text"
                data-cy="limboWinChance"
              >
                {targetCoeff && parseFloat(targetCoeff) !== 0
                  ? `${(95 / parseFloat(targetCoeff)).toFixed(2)}%`
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
