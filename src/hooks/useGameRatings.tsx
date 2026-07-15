import { useEffect } from 'react';
import useSWRMutation from 'swr/mutation';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';

import { graphFetcher } from '@/api/graph.ts';
import { useGameEndEvents } from '@/hooks/useGameEndEvents.ts';
import { getHistory, type IHistory } from '@/lib/graph/queries/getDashboard.ts';
import { type GameName } from '@/lib/graph/queries/types';

export type GameRating = {
  id: string;
  user: string;
  betAmount: string;
  multiplier: string;
  payout: string;
  requestId: string;
  date: Date;
};

export type SlotsGameRating = {
  id: string;
  betAmount: string;
  multiplier: string;
  payout: string;
  date: Date;
  requestId: string;
  claimable: boolean;
};

function calculateMultiplier(winAmount: number, betAmount: number) {
  let multiplier = winAmount / betAmount;
  multiplier = Math.round(multiplier * 100) / 100;
  return multiplier;
}

export const useGameRatings = (gameName: GameName) => {
  const { address } = useAccount();

  const {
    data: untypedHistory,
    isMutating: isDashboardLoading,
    trigger,
  } = useSWRMutation(
    {
      query: getHistory(),
      fetchPolicy: 'network-only',
      variables: {
        user: address,
        name: gameName
          .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
          .replace(/^./, (c) => c.toUpperCase()),
      },
    },
    graphFetcher,
  );

  const { gameEndRequestIds, gameEndLoading } = useGameEndEvents(gameName);

  useEffect(() => {
    trigger();
  }, [trigger]);

  const history = untypedHistory as { data: IHistory } | undefined;

  const formattedHistory: GameRating[] | null = history
    ? history?.data.gameHistories.map((ge) => {
        return {
          id: ge.id,
          user: ge.user,
          betAmount: formatUnits(BigInt(ge.bet), 18),
          multiplier: String(calculateMultiplier(ge.win, ge.bet)),
          requestId: ge.requestId,
          payout: formatUnits(BigInt(ge.win), 18),
          date: new Date(Number(ge.date + '000')),
        };
      })
    : null;

  return {
    ratings: formattedHistory,
    ratingsLoading: isDashboardLoading || gameEndLoading,
    gameEndRequestIds,
    trigger,
  };
};
