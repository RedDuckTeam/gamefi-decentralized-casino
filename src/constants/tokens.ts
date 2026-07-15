import { type Address } from 'viem';

import { getContractAddresses } from './contracts';
import { ChainId } from './supported-chains';

export type TokenConfig = {
  address: Address;
  symbol: string;
  decimals: number;
};

export const getTokensConfig = (chainId: number): TokenConfig[] => {
  const config = {
    [ChainId.LOCALHOST]: [
      {
        address: getContractAddresses(chainId).casinoToken,
        symbol: 'T',
        decimals: 18,
      },
    ],
    [ChainId.ARBITRUM]: [
      {
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9' as Address,
        symbol: 'USDT',
        decimals: 6,
      },
      {
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' as Address,
        symbol: 'USDC',
        decimals: 6,
      },
    ],
    [ChainId.ARBITRUM_SEPOLIA]: [
      {
        address: getContractAddresses(chainId).casinoToken,
        symbol: 'T',
        decimals: 18,
      },
    ],
  };

  return config[chainId as ChainId];
};
