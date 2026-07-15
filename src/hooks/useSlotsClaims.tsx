import { useQuery } from '@tanstack/react-query';
import { type Address } from 'viem';
import { useAccount } from 'wagmi';

import { type GameRating, useGameRatings } from './useGameRatings';

import { getSlotsClaimEventsQuery } from '@/lib/graph/queries/getSlotsClaimEvents';
import { type SlotsClaim } from '@/lib/graph/types';
import { apolloClient } from '@/providers/apollo-client';

const slotsClaimsQuery = async (
  userAddress: Address | undefined,
  requestIds: string[],
) => {
  const response = await apolloClient.query({
    query: getSlotsClaimEventsQuery({
      first: true,
      user: true,
      requestId: true,
    }),
    fetchPolicy: 'network-only',
    variables: {
      user: userAddress,
      requestId_in: requestIds,
    },
  });

  return response.data.slotsClaims as SlotsClaim[];
};

export const useSlotsClaims = () => {
  const { address } = useAccount();

  const { ratings, ratingsLoading, gameEndRequestIds, trigger } =
    useGameRatings('slots');

  const {
    data,
    isLoading,
    refetch: refetchClaimsQuery,
  } = useQuery({
    queryKey: ['slots-claims', gameEndRequestIds.join('-')],
    queryFn: gameEndRequestIds.length
      ? () => slotsClaimsQuery(address, gameEndRequestIds)
      : () => null,
  });

  const mapSlotsRatings = (data: SlotsClaim[], ratings: GameRating[]) => {
    return ratings
      ? ratings.map((rating) => {
          return {
            ...rating,
            claimable:
              data?.findIndex((c) => c.requestId === rating.requestId) === -1,
          };
        })
      : null;
  };

  return {
    claimsData: data && ratings ? mapSlotsRatings(data, ratings) : null,
    claimsLoading: isLoading || ratingsLoading,
    trigger: () => trigger().then(() => refetchClaimsQuery()),
  };
};
