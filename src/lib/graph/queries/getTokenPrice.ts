import { gql } from '@apollo/client';

export const getTokenPrice = () => {
  return gql`
    query GetTokenPrice($tokenAddress: Bytes) {
      fastPrice(id: $tokenAddress) {
        value
        token
      }
    }
  `;
};
