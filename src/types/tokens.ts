import { type Address } from 'viem';

export type BetToken = {
  address: Address;
  symbol: string;
  icon: string;
  balance: bigint;
  decimals: number;
};
