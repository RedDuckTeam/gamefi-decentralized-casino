import { gql } from '@apollo/client';

import { type GameName } from './types';

export const getAllowedTokens = (gameName: GameName) => {
  return gql`
    query GetAllowedTokens {
        ${gameName}TokenAlloweds(where: { isAllowed: true }) {
          id
          isAllowed
          tokenAddress
        }
    }
    `;
};
