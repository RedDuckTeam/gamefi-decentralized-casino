import { useEffect } from 'react';

import { GameInfo, GameRatings, GameSection } from '@/components/game-layout';
import { PlinkoCalculator, PlinkoGame } from '@/components/games/plinko';
import { plinkoInfoConfig } from '@/constants/plinko.ts';
import { useGameRatings } from '@/hooks/useGameRatings';

export const PlinkoPage = () => {
  const { ratings, ratingsLoading, trigger } = useGameRatings('plinko');

  useEffect(() => {
    trigger();

    const intervalId = setInterval(() => {
      trigger();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [trigger]);

  return (
    <div className="grid grid-cols-1 gap-10 p-3 lg:p-6">
      <GameSection>
        <PlinkoCalculator />
        <PlinkoGame />
      </GameSection>
      <GameRatings ratings={ratings} ratingsLoading={ratingsLoading} />
      <GameInfo config={plinkoInfoConfig} />
    </div>
  );
};
