import { Coin } from './coin';

import { Badge } from '@/components/ui/badge';
import { type CoinflipVariant, coinflipConfig } from '@/constants/coinflip';
import { cn } from '@/lib/utils';
import { type CoinflipGameState, type CoinflipHistory } from '@/pages/coinflip';

interface CoinflipGameProps {
  gameIsRunning: boolean;
  isLose: boolean;
  isWin: boolean;
  selectedSide: CoinflipVariant;
  recentWins: CoinflipHistory[];
  recentResult: CoinflipGameState;
  oppositeSide: CoinflipVariant | null;
  oppositeSideCopy: CoinflipVariant | null;
  betId: number;
}

export default function CoinflipGame({
  selectedSide,
  recentResult,
  recentWins,
  oppositeSide,
  betId,
  oppositeSideCopy,
}: CoinflipGameProps) {
  const selectedSideImage = coinflipConfig.find(
    (i) => i.name == selectedSide,
  )?.img;

  return (
    <div className="relative flex h-[635px] items-center justify-center rounded-[18px] text-4xl font-bold">
      <img
        src="/images/pages/coinflip/game-bg.webp"
        className="image-container z-0 opacity-70 blur-[2px]"
        alt="bg"
      />
      <div className="z-10 flex h-full flex-col items-center justify-around">
        <div className="absolute right-5 top-5 flex gap-1">
          {recentWins.map(({ state, variant }, index) => (
            <Badge
              key={index}
              variant={state === 'win' ? 'success' : 'default'}
            >
              {variant}
            </Badge>
          ))}
        </div>
        <div />
        {/* {import.meta.env.VITE_EXPERIMENTAL_SHOW_RESULT === 'true' && ( */}
        <div className="absolute top-[16%] text-2xl sm:top-[12%]">
          {oppositeSideCopy}
        </div>
        {/* )} */}
        <div className="mx-4 grid grid-cols-2 gap-4">
          <div
            className={cn(
              'flex h-[210px] flex-col items-center justify-between gap-4 rounded-[40px] border-[6px] bg-[#161928] p-6 transition-all sm:h-[270px]',
              recentResult === 'win'
                ? 'border-[#14BE7D]'
                : recentResult === 'lose'
                  ? 'border-[#FA315F]'
                  : 'border-[#161928]',
            )}
          >
            <p className="text-xs font-bold text-text">You</p>
            <img
              className="w-16 sm:w-32"
              src={selectedSideImage}
              alt="Selected side"
            />
            <p data-cy="coinFlipSelectedSide" className="text-base text-text">
              {selectedSide}
            </p>
          </div>
          <div className="flex h-[210px] flex-col items-center justify-between gap-4 rounded-[40px] border-[6px] border-[#161928] bg-[#161928] p-6 sm:h-[270px]">
            <p className="text-xs font-bold text-text">House</p>
            {/*<img className="w-16" src={oppositeSideImage} alt="" />*/}
            <Coin betId={betId} result={oppositeSide} />
            <p
              data-cy="coinFlipHouseSide"
              className="h-6 text-base text-text transition-all"
            >
              {oppositeSideCopy}
            </p>
          </div>
        </div>
        <div className="flex gap-2 rounded-[32px] bg-[#070513] p-2">
          <div className="flex w-[100px] flex-col rounded-[32px] bg-[#161928] px-4 py-2 text-center sm:w-[140px]">
            <p className="text-xs text-[#8C98A9]">Win</p>
            <p className="text-sm text-text">50%</p>
          </div>
          <div className="flex w-[100px] flex-col rounded-[32px] bg-[#161928] px-4 py-2 text-center sm:w-[140px]">
            <p className="text-xs text-[#8C98A9]">Payout</p>
            <p className="text-sm text-text">x2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
