import { useEffect, useState } from 'react';

import SvgLoader from '../../ui/svg/spinning-circles.svg';

import { Button } from '@/components/ui/button';
import PockerChipsSvg from '@/components/ui/svg/poker-chips.svg';
import { type SlotsGameRating } from '@/hooks/useGameRatings';
import { formatWithComma } from '@/lib/utils';

const INITIAL_DISPLAY_COUNT = 10;

export default function SlotsGameRatings({
  ratings,
  ratingsLoading,
  onClaim,
}: {
  ratings: SlotsGameRating[] | null;
  ratingsLoading: boolean;
  onClaim: (requestIds: string | string[]) => void;
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

  const handleClaimAll = () => {
    const filteredRatings = ratings
      ? ratings.filter((r) => r.claimable && +r.payout)
      : null;

    if (filteredRatings) {
      onClaim(filteredRatings.map(({ requestId }) => requestId));
    }
  };

  const index = displayedRatings?.findIndex((x) => x.claimable && +x.payout);

  return (
    <div className="p-6">
      <div className="flex h-[32px] justify-between">
        <h3 className="text-[16px] text-text">Rating</h3>
        {typeof index === 'number' && index !== -1 && (
          <Button onClick={handleClaimAll} className="flex h-8 items-center">
            Claim all
          </Button>
        )}
      </div>
      <div className="overflow-x-scroll">
        <div className="mt-6 flex min-w-[700px] flex-col">
          <div className="flex py-2 text-[12px] font-bold">
            <div className="min-w-[20%]">Bet Amount</div>
            <div className="w-full">Multiplier</div>
            <div className="w-full">Payout</div>
            <div className="w-full">Date</div>
            <div className="w-full text-right"></div>
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
                  {/* <div className="min-w-[20%] overflow-hidden text-ellipsis pr-2 lg:min-w-[40%]">
                  {rating.user}
                </div> */}
                  <div className="flex min-w-[20%] items-center gap-2">
                    <img src={PockerChipsSvg} alt="chips" />
                    {formatWithComma(+rating.betAmount)}
                  </div>
                  <div className="w-full">{rating.multiplier}x</div>
                  <div className="flex w-full items-center gap-2 text-[rgba(20,190,125,1)]">
                    <img src={PockerChipsSvg} alt="chips" />
                    {formatWithComma(+rating.payout)}
                  </div>
                  <div className="w-full">
                    {rating.date.toLocaleString('uk')}
                  </div>
                  <div className="flex w-full items-center justify-end text-right">
                    {rating.claimable && +rating.payout ? (
                      <p className="px-6 text-[rgb(151,71,255)]">
                        Waiting for claim
                      </p>
                    ) : +rating.payout ? (
                      <p className="px-6 text-[rgba(20,190,125,1)]">Claimed</p>
                    ) : null}
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
