import { useEffect, useState } from 'react';

import { DiceSlider } from './components/dice-slider';

import { Number } from '@/components/games/dice/components/number.tsx';
import { Badge } from '@/components/ui/badge';
import diceImage from '@/components/ui/svg/dice.svg';
import sliderHint from '@/components/ui/svg/slider-hint.svg';
import { SliderVariant } from '@/constants/dice';
import { cn, formatNumberWithLeadingZeros } from '@/lib/utils';
import { type DiceGameResult } from '@/pages/dice';

interface DiceGameProps {
  rand: number[];
  isWin: boolean;
  isLose: boolean;
  selectedValue: number;
  setSelectedValue(value: number): void;
  roll: SliderVariant;
  setRoll(value: SliderVariant): void;
  previousBets: DiceGameResult[];
}

export default function DiceGame({
  rand,
  isLose,
  isWin,
  selectedValue,
  setSelectedValue,
  roll,
  setRoll,
  previousBets,
}: DiceGameProps) {
  const [hintPosition, setHintPosition] = useState(50 * 0.98);
  const [payout, setPayout] = useState(2);

  const handleSelectValue = (value: number) => {
    setSelectedValue(value);
    setHintPosition(value * 0.98);
  };

  useEffect(() => {
    if (roll === SliderVariant.UNDER) {
      setPayout(100 / selectedValue);
    } else {
      setPayout(100 / (100 - selectedValue));
    }
  }, [roll, selectedValue]);

  const handleAddCoeff = (coeffToAdd: number) => {
    if (selectedValue + coeffToAdd > 99.98) {
      handleSelectValue(99.98);
      return;
    }
    if (selectedValue + coeffToAdd < 0.02) {
      handleSelectValue(0.02);
      return;
    }
    handleSelectValue(selectedValue + coeffToAdd);
  };

  return (
    <div className="flex flex-col bg-[url('/images/pages/dice/game-bg.png')] bg-cover p-[24px]">
      <div className="flex w-full justify-between">
        <div>
          <img src={diceImage} alt="dice" />
        </div>
        <div data-cy="diceBetResult" className="flex w-full justify-end gap-1">
          {previousBets.map((bet, i) => (
            <Badge variant={bet.result ? 'success' : 'destructive'} key={i}>
              {formatNumberWithLeadingZeros(bet.randomNum).slice(0, 2)}.
              {formatNumberWithLeadingZeros(bet.randomNum).slice(2, 4)}
            </Badge>
          ))}
        </div>
      </div>
      <div
        className={`mt-[57px] flex flex-row justify-center gap-[12px] text-[#F1F1F] ${
          isWin && 'text-success'
        } ${isLose && 'text-danger'}`}
      >
        <Number number={rand[0]} />
        <Number number={rand[1]} />
        <div className="mt-auto h-[14px] w-[14px] rounded-full bg-[#272B3F]" />
        <Number number={rand[2]} />
        <Number number={rand[3]} />
      </div>
      <div className="gap- mt-[70px] flex flex-row justify-center">
        <button
          onClick={() => handleAddCoeff(-1)}
          className="flex h-[36px] w-[40px] items-center justify-center rounded-[12px] bg-[#272B3F]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M4.16699 10H15.8337"
              stroke="#F1F1F1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="flex w-full flex-col gap-3">
          <div className="relative">
            <DiceSlider
              onValueChange={(e: [number]) => handleSelectValue(...e)}
              min={0.02}
              value={[selectedValue]}
              max={99.98}
              defaultValue={[33]}
              variant={roll}
              step={0.01}
              className="mt-[70px] "
              id="myRange"
            />
            <div
              className="absolute h-8 w-16 text-white"
              style={{
                left: `calc(${hintPosition}%)`,
                transform: 'translate(-16px,-70px)',
              }}
            >
              <img src={sliderHint} className="absolute z-[-1]" alt="hint" />
              <div className="w-[53px] pt-1 text-center text-[14px]">
                {selectedValue.toFixed(2)}
              </div>
            </div>
          </div>
          <div className="flex w-full flex-row items-center justify-between gap-[12px] pl-2.5 text-[14px]">
            <div>0</div>
            <div className="h-0 w-full border-b-[1px] border-dashed border-[#2A3156]" />
            <button
              onClick={() => handleSelectValue(25)}
              data-cy="dice25chance"
            >
              25
            </button>
            <div className="h-0 w-full border-b-[1px] border-dashed border-[#2A3156]" />
            <button
              onClick={() => handleSelectValue(50)}
              data-cy="dice50chance"
            >
              50
            </button>
            <div className="h-0 w-full border-b-[1px] border-dashed border-[#2A3156]" />
            <button
              onClick={() => handleSelectValue(75)}
              data-cy="dice75chance"
            >
              75
            </button>
            <div className="h-0 w-full border-b-[1px] border-dashed border-[#2A3156]" />
            <div>100</div>
          </div>
        </div>
        <button
          onClick={() => handleAddCoeff(1)}
          className="flex h-[36px] w-[40px] items-center justify-center rounded-[12px] bg-[#272B3F]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M10.0003 4.16663V15.8333M4.16699 9.99996H15.8337"
              stroke="#F1F1F1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="mx-auto mt-[80px] grid w-fit grid-cols-2 gap-[8px] rounded-[32px] bg-[#070513] p-[8px] text-[12px] md:grid-cols-4 md:text-[14px]">
        <button
          onClick={() => setRoll(SliderVariant.UNDER)}
          className={cn(
            'h-[57px] rounded-[32px] px-[30px] font-semibold transition-all',
            roll === SliderVariant.UNDER
              ? 'bg-[#FA315F]'
              : 'bg-[#FA315FB3] text-text/80',
          )}
          data-cy="rollUnderBtn"
        >
          Roll under
        </button>
        <button
          className="h-[57px] rounded-[32px] bg-[#161928] px-[30px]"
          data-cy="dicePayout"
        >
          <span className="text-[12px] text-[#8C98A9]">Payout</span> <br /> x
          {payout.toFixed(2)}
        </button>
        <button
          className="h-[57px] rounded-[32px] bg-[#161928] px-[30px]"
          data-cy="diceWinChance"
        >
          <span className="text-[12px] text-[#8C98A9]">Win chance</span> <br />{' '}
          {(100 / payout).toFixed(2)}%
        </button>
        <button
          onClick={() => setRoll(SliderVariant.OVER)}
          className={cn(
            'h-[57px] rounded-[32px] px-[30px] font-semibold transition-all',
            roll === SliderVariant.OVER
              ? 'bg-[#14BE7D]'
              : 'bg-[#14BE7DB3] text-text/80',
          )}
          data-cy="rollOverBtn"
        >
          Roll over
        </button>
      </div>
    </div>
  );
}
