import {
  type DocumentNode,
  type FetchPolicy,
  type OperationVariables,
} from '@apollo/client';

import { apolloClient } from '@/providers/apollo-client.ts';

interface GraphQuery {
  query: DocumentNode;
  variables?: OperationVariables;
  fetchPolicy?: string;
}

export const graphFetcher = (options: GraphQuery) => {
  return apolloClient.query({
    ...options,
    fetchPolicy: options.fetchPolicy as FetchPolicy | undefined,
  });
};
