import { gql } from '@apollo/client';

import { type GameName } from './types';

type GameRefundsQueryOptions = {
  user?: boolean;
  latest?: boolean;
};

export const getRefundEventsQuery = (
  gameName: GameName,
  { latest = false, user = false }: GameRefundsQueryOptions,
) => {
  const args = [];
  if (user) args.push('where: { user: $user }');
  if (latest) {
    args.push('orderBy: blockTimestamp', 'orderDirection: desc');
  }

  const argsStr = args.length > 0 ? `(${args.join(', ')})` : '';

  return gql`
    query GetRefundEvents($user: Bytes) {
        ${gameName}Refunds${argsStr} {
            blockNumber
            blockTimestamp
            id
            requestId
            user
            transactionHash
        }
    }
`;
};
