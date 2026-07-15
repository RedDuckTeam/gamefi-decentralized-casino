import { useEffect, useState } from 'react';

import {
  rpsGameConfig,
  type RockPaperScissorsVariant,
} from '@/constants/rock-paper-scissors';
import { cn } from '@/lib/utils';
import {
  type RpsHistory,
  type RpsGameState,
} from '@/pages/rock-paper-scissors';

export default function RockPaperScissorsGame({
  recentWins,
  recentResult,
  selectedSide,
  oppositeSide,
}: {
  recentWins: RpsHistory[];
  recentResult: RpsGameState;
  selectedSide: RockPaperScissorsVariant;
  oppositeSide: RockPaperScissorsVariant | null;
}) {
  const [oppositeSideCopy, setOppositeSideCopy] = useState(oppositeSide);

  const selectedSideImage = rpsGameConfig.find(
    (i) => i.name == selectedSide,
  )?.img;
  const oppositeSideImage = rpsGameConfig.find(
    (i) => i.name == (oppositeSide === null ? oppositeSideCopy : oppositeSide),
  )?.img;

  useEffect(() => {
    if (oppositeSide !== null) {
      setOppositeSideCopy(oppositeSide);
    }
  }, [oppositeSide]);

  return (
    <div className='h-[635px] w-full bg-[url("/images/pages/rock-paper-scissors/game-bg.webp")]'>
      <div className="relative flex h-full flex-col items-center justify-around">
        <div
          data-cy="rpsGameResult"
          className="absolute right-5 top-5 flex gap-1"
        >
          {recentWins.map(({ state, variant }, index) => (
            <div
              key={index}
              className={cn(
                'rounded-[16px] px-3 py-[6px]',
                state === 'win'
                  ? 'bg-[#14BE7D]'
                  : state === 'lose'
                    ? 'bg-[#070513]'
                    : 'bg-[#f7931a]',
              )}
            >
              {variant}
            </div>
          ))}
        </div>
        <div />
        {/* {import.meta.env.VITE_EXPERIMENTAL_SHOW_RESULT === 'true' && ( */}
        <div className="absolute top-[18%] text-2xl md:top-[12%]">
          {oppositeSide}
        </div>
        {/* )} */}
        <div className="grid grid-cols-2 gap-8">
          <div
            className={cn(
              'flex h-[170px] flex-col items-center justify-between gap-4 rounded-[40px] border-[6px] bg-[#161928] p-6 md:h-[270px]',
              recentResult === 'win'
                ? 'border-[#14BE7D]'
                : recentResult === 'lose'
                  ? 'border-[#FA315F]'
                  : 'border-[#161928]',
            )}
          >
            <p className="text-xs font-bold text-text">You</p>
            <img
              className="w-16 md:w-32"
              src={selectedSideImage}
              alt="Selected side"
            />
            <p data-cy="rpsSelectedSide" className="text-base text-text">
              {selectedSide}
            </p>
          </div>
          <div className="flex h-[170px] flex-col items-center justify-between gap-4 rounded-[40px] border-[6px] border-[#161928] bg-[#161928] p-6 md:h-[270px]">
            <p className="text-xs font-bold text-text">House</p>
            <img
              className={cn(
                'rps-transition w-16 md:w-32',
                oppositeSide ? 'rps-transition-active' : '',
              )}
              src={oppositeSideImage}
              alt="opposite-side"
            />
            <p
              data-cy="rpsOppositeSide"
              className={cn(
                'rps-transition min-h-[24px] text-base text-text',
                oppositeSide ? 'rps-transition-active' : '',
              )}
            >
              {oppositeSide}
            </p>
          </div>
        </div>
        <div className="flex gap-2 rounded-[32px] bg-[#070513] p-2">
          <div className="flex w-[77px] flex-col rounded-[32px] bg-[#161928] px-4 py-2 text-center md:w-[140px]">
            <p className="text-xs text-[#8C98A9]">Win</p>
            <p className="text-sm text-text">x2</p>
          </div>
          <div className="flex w-[77px] flex-col rounded-[32px] bg-[#161928] px-4 py-2 text-center md:w-[140px]">
            <p className="text-xs text-[#8C98A9]">Draw</p>
            <p className="text-sm text-text">x1</p>
          </div>
          <div className="flex w-[77px] flex-col rounded-[32px] bg-[#161928] px-4 py-2 text-center md:w-[140px]">
            <p className="text-xs text-[#8C98A9]">Loss</p>
            <p className="text-sm text-text">-</p>
          </div>
        </div>
      </div>
    </div>
  );
}
