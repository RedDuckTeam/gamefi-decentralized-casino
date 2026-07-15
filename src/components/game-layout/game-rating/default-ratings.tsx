import { useEffect, useState } from 'react';

import SvgLoader from '../../ui/svg/spinning-circles.svg';

import PockerChipsSvg from '@/components/ui/svg/poker-chips.svg';
import { type GameRating } from '@/hooks/useGameRatings';
import { formatWithComma } from '@/lib/utils';
const INITIAL_DISPLAY_COUNT = 10;

export default function GameRatings({
  ratings,
  ratingsLoading,
}: {
  ratings: GameRating[] | null;
  ratingsLoading: boolean;
}) {
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [displayedRatings, setDisplayedRatings] = useState(
    ratings ? ratings.slice(0, INITIAL_DISPLAY_COUNT) : null,
  );

  useEffect(() => {
    setDisplayedRatings(ratings ? ratings.slice(0, displayCount) : null);
  }, [displayCount, ratings]);

  const handleShowMore = () => {
    const newDisplayCount = displayCount + INITIAL_DISPLAY_COUNT;
    setDisplayCount(newDisplayCount);
    setDisplayedRatings(ratings ? ratings.slice(0, newDisplayCount) : null);
  };

  const handleHide = () => {
    const newDisplayCount = INITIAL_DISPLAY_COUNT;
    setDisplayCount(newDisplayCount);
    setDisplayedRatings(ratings ? ratings.slice(0, newDisplayCount) : null);
  };

  return (
    <div>
      <div className="overflow-x-scroll p-6">
        <h3 className="text-[16px] text-text">Rating</h3>
        <div className="mt-6 flex min-w-[700px] flex-col">
          <div className="flex py-2 text-[12px] font-bold">
            <div className="min-w-[20%] lg:min-w-[40%]">User</div>
            <div className="min-w-[20%]">Bet Amount</div>
            <div className="w-full">Multiplier</div>
            <div className="w-full">Payout</div>
            <div className="w-full text-right">Date</div>
          </div>
          <div className="mt-4">
            {ratingsLoading && !ratings ? (
              <div className="flex justify-center pb-2">
                <img className="h-8 w-auto" src={SvgLoader} alt="loader" />
              </div>
            ) : !ratingsLoading && (!ratings || ratings?.length === 0) ? (
              <div className="h-[41px] border-b border-[#22252f] pb-2 text-center text-lg">
                History is clear
              </div>
            ) : (
              displayedRatings?.map((rating) => (
                <div
                  key={rating.id}
                  className={`flex items-center border-b border-[#22252f] py-1`}
                >
                  <div className="min-w-[20%] overflow-hidden text-ellipsis pr-2 lg:min-w-[40%]">
                    {rating.user}
                  </div>
                  <div className="flex min-w-[20%] items-center gap-2">
                    <img src={PockerChipsSvg} alt="chips" />
                    {formatWithComma(+rating.betAmount)}
                  </div>
                  <div className="w-full">{rating.multiplier}x</div>
                  <div className="flex w-full items-center gap-2 text-[rgba(20,190,125,1)]">
                    <img src={PockerChipsSvg} alt="chips" />
                    {formatWithComma(+rating.payout)}
                  </div>
                  <div className="w-full text-right">
                    {rating.date.toLocaleString('uk')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-8">
        {ratings && ratings.length > 10 && ratings.length > displayCount && (
          <button
            onClick={handleShowMore}
            className="mt-4 text-[#4a5172] underline underline-offset-2"
          >
            Show More
          </button>
        )}

        {displayCount > 10 && (
          <button
            onClick={handleHide}
            className="mt-4 text-[#4a5172] underline underline-offset-2"
          >
            Hide
          </button>
        )}
      </div>
    </div>
  );
}
