import { gql } from '@apollo/client';

export const getUserCodesQuery = () => gql`
  query GetUserCodes($owner: Bytes) {
    referralCodes(where: { owner: $owner }, orderBy: id, orderDirection: desc) {
      owner
      code
      id
    }
  }
`;
