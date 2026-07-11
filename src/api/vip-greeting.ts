import { type AxiosResponse } from 'axios';
import { type Address } from 'viem';

import { instance } from '@/api/utils.ts';

export enum VipRank {
  DEFAULT = 0,
  BRONZE = 1,
  SILVER = 2,
  GOLD = 3,
}

export type VipGreeting = {
  address: Address;
  rank: VipRank;
};

export const apiGetVipGreeting = (
  address: Address,
): Promise<AxiosResponse<VipGreeting>> =>
  instance.get('/vip-greeting', {
    params: {
      address,
    },
  });

export const apiPostVipGreeting = (
  address: Address,
  rank: number,
  token: string,
) =>
  instance.post(
    '/vip-greeting',
    { address, rank: Number(rank) },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export const apiDeleteVipGreeting = (address: Address, token: string) =>
  instance.delete('/vip-greeting', {
    params: {
      address,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
