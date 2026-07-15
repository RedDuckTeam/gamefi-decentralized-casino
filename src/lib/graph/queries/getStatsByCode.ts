import { gql } from '@apollo/client';

export const getStatsByCodeQuery = () => gql`
  query GetUserStats($affiliate: Bytes) {
    affiliateStats(where: { affiliate: $affiliate, period: total }) {
      trades
      registeredReferralsCount
      referralCode
    }
  }
`;
