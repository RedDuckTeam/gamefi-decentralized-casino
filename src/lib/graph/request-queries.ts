import { type Address } from 'viem';

import { getGameEndEventsQuery } from './queries/getGameEndEvents';
import { getGameStartEventsQuery } from './queries/getGameStartEvents';
import { getRefundEventsQuery } from './queries/getRefundEvents';
import { getStatsByCodeQuery } from './queries/getStatsByCode';
import { getUserCodesQuery } from './queries/getUserCodes';
import { type GameName } from './queries/types';
import {
  type GameStart,
  type GameEnd,
  type Refund,
  type UserCode,
  type CodeStats,
} from './types';

import { apolloClient, apolloClientReferrals } from '@/providers/apollo-client';

export const requestGameEnds = async (gameName: GameName, user?: Address) => {
  const response = await apolloClient.query({
    query: getGameEndEventsQuery(gameName, { user: !!user, latest: true }),
    fetchPolicy: 'network-only',
    variables: {
      user,
    },
  });

  return response.data[`${gameName}GameEnds`] as GameEnd[];
};

export const requestGameStarts = async (gameName: GameName, user?: Address) => {
  const response = await apolloClient.query({
    query: getGameStartEventsQuery(gameName, { user: !!user, latest: true }),
    fetchPolicy: 'network-only',
    variables: {
      user,
    },
  });

  return response.data[`${gameName}GameStarts`] as GameStart[];
};

export const requestRefunds = async (gameName: GameName, user?: Address) => {
  const response = await apolloClient.query({
    query: getRefundEventsQuery(gameName, { user: !!user, latest: true }),
    fetchPolicy: 'network-only',
    variables: {
      user,
    },
  });

  return response.data[`${gameName}Refunds`] as Refund[];
};

export const requestUserCodes = async (owner?: Address) => {
  const response = await apolloClientReferrals.query({
    query: getUserCodesQuery(),
    fetchPolicy: 'network-only',
    variables: {
      owner: owner?.toLowerCase(),
    },
  });

  return response.data['referralCodes'] as UserCode[];
};

export const requestCodeStats = async (affiliate?: Address) => {
  const response = await apolloClientReferrals.query({
    query: getStatsByCodeQuery(),
    fetchPolicy: 'network-only',
    variables: {
      affiliate: affiliate?.toLowerCase(),
    },
  });

  return response.data['affiliateStats'] as CodeStats[];
};
