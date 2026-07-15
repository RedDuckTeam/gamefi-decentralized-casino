import { gql } from '@apollo/client';

type GameStartQueryOptions = {
  user?: boolean;
  first?: boolean;
  requestId?: boolean;
};

export const getSlotsClaimEventsQuery = ({
  user = false,
  first = false,
  requestId = false,
}: GameStartQueryOptions) => {
  const args = [];
  const whereConditions = [];

  if (user) whereConditions.push('user: $user');
  if (requestId) whereConditions.push(`requestId_in: $requestId_in`);

  if (whereConditions.length > 0)
    args.push(`where: { ${whereConditions.join(', ')} }`);

  if (first) args.push(`first: $first`);

  const argsStr = args.length > 0 ? `(${args.join(', ')})` : '';

  return gql`
      query GetSlotsClaimsEvents($user: Bytes, $first: Int, $requestId_in: [String!]!) {
        slotsClaims${argsStr} {
          id
          user
          amount
          requestId
          blockNumber
          blockTimestamp
          transactionHash
        }
      }
      `;
};
