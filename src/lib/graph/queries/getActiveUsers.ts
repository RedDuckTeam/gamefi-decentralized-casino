import { gql } from '@apollo/client';

export const getActiveUsers = () => {
  return gql`
    query GetActiveUsers($tokenAddress: String) {
      gameProfits(
        first: 1000
        orderBy: sumOfBets
        orderDirection: desc
        where: { tokenAddress: $tokenAddress }
      ) {
        id
        sumOfWins
        sumOfBets
        userAddress
        tokenDecimals
      }
    }
  `;
};
