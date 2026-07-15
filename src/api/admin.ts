import { type Address } from 'viem';

import { instance } from '@/api/utils.ts';

export const apiGetAdmin = (address: Address, token: string) =>
  instance.get('/admin', {
    params: {
      address,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const apiPostAdmin = (address: Address, token: string) =>
  instance.post(
    '/admin',
    {},
    {
      params: {
        address,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

export const apiDeleteAdmin = (address: Address, token: string) =>
  instance.delete('/admin', {
    params: {
      address,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
