import { gql } from '@apollo/client';

import { type GameName } from './types';

type GameEndQueryOptions = {
  user?: boolean;
  first?: boolean;
  latest?: boolean;
};

export const getGameEndEventsQuery = (
  gameName: GameName,
  { user = false, first = false, latest = false }: GameEndQueryOptions,
) => {
  const args = [];
  if (user) args.push('where: { user: $user }');
  if (first) args.push(`first: $first`);
  if (latest) {
    args.push('orderBy: blockTimestamp', 'orderDirection: desc');
  }

  const argsStr = args.length > 0 ? `(${args.join(', ')})` : '';

  return gql`
    query GetGameEndEvents($user: Bytes, $first: Int) {
      ${gameName}GameEnds${argsStr} {
        amountPaid
        blockNumber
        blockTimestamp
        id
        randomNumber
        requestId
        result
        secondRandomNumber
        transactionHash
        user
        userBet
      }
    }
    `;
};
