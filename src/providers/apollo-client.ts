import { ApolloClient, InMemoryCache } from '@apollo/client';

import {
  GRAPH_URL,
  GRAPH_URL_STATS,
  GRAPH_URL_REFERRALS,
} from '@/constants/graph-url';

export const apolloClient = new ApolloClient({
  uri: GRAPH_URL,
  cache: new InMemoryCache(),
});

export const apolloStatsClient = new ApolloClient({
  uri: GRAPH_URL_STATS,
  cache: new InMemoryCache(),
});

export const apolloClientReferrals = new ApolloClient({
  uri: GRAPH_URL_REFERRALS,
  cache: new InMemoryCache(),
});
