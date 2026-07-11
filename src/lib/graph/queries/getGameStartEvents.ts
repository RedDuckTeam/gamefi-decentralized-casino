import { gql } from '@apollo/client';

import { type GameName } from './types';

type GameStartQueryOptions = {
  user?: boolean;
  first?: boolean;
  requestId?: boolean;
  latest?: boolean;
};

export const getGameStartEventsQuery = (
  gameName: GameName,
  {
    user = false,
    first = false,
    requestId = false,
    latest = false,
  }: GameStartQueryOptions,
) => {
  const args = [];
  const whereConditions = [];

  if (latest) {
    args.push('orderBy: blockTimestamp', 'orderDirection: desc');
  }

  if (user) whereConditions.push('user: $user');
  if (requestId) whereConditions.push(`requestId_in: $requestId_in`);

  if (whereConditions.length > 0)
    args.push(`where: { ${whereConditions.join(', ')} }`);

  if (first) args.push(`first: $first`);

  const argsStr = args.length > 0 ? `(${args.join(', ')})` : '';

  return gql`
      query GetGameStartEvents($user: Bytes, $first: Int, $requestId_in: [String]) {
        ${gameName}GameStarts${argsStr} {
          betAmount
          blockNumber
          blockTimestamp
          fee
          id
          requestId
          transactionHash
          user
        }
      }
      `;
};
