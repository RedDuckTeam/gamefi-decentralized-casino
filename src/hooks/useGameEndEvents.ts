import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { type Address } from 'viem';
import { useAccount } from 'wagmi';

import { getGameEndEventsQuery } from '@/lib/graph/queries/getGameEndEvents';
import { type GameName } from '@/lib/graph/queries/types';
import { type GameEnd } from '@/lib/graph/types';
import { apolloClient } from '@/providers/apollo-client';

const gameEndQuery = async (
  gameName: GameName,
  userAddress: Address | undefined,
) => {
  const response = await apolloClient.query({
    query: getGameEndEventsQuery(gameName, {
      first: true,
      user: true,
      latest: true,
    }),
    fetchPolicy: 'network-only',
    variables: {
      user: userAddress,
      first: 100,
    },
  });

  return response.data[`${gameName}GameEnds`] as GameEnd[];
};

export const useGameEndEvents = (gameName: GameName) => {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`${gameName}-ratings`],
    queryFn: () => gameEndQuery(gameName, address),
  });

  const requestIds = useMemo(() => {
    return data ? [...new Set(data.map(({ requestId }) => requestId))] : [];
  }, [data]);

  return {
    gameEndData: data,
    gameEndRequestIds: requestIds,
    gameEndLoading: isLoading,
    refetchGameEnd: refetch,
  };
};
