import { type AxiosResponse } from 'axios';
import { type Address } from 'viem';

import { instance } from '@/api/utils.ts';

export enum ReferralTier {
  BRONZE = 0,
  SILVER = 1,
  GOLD = 2,
}

export type ReferralsGreeting = {
  address: Address;
  tier: ReferralTier;
};

export const apiGetReferralsGreeting = (
  address: Address,
): Promise<AxiosResponse<ReferralsGreeting>> =>
  instance.get('/referrals-greeting', {
    params: {
      address,
    },
  });

export const apiPostReferralsGreeting = (
  address: Address,
  tier: number,
  token: string,
) =>
  instance.post(
    '/referrals-greeting',
    { address, tier: Number(tier) },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export const apiDeleteReferralsGreeting = (address: Address, token: string) =>
  instance.delete('/referrals-greeting', {
    params: {
      address,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
