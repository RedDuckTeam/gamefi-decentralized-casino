import { gql } from '@apollo/client';

export const getTokensAlreadyUse = () => {
  return gql`
    query GetTokensAlreadyUse {
      tokenAlreadyUses(first: 1000) {
        id
        address
        decimals
        symbol
      }
    }
  `;
};
