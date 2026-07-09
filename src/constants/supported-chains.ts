import { type Chain, arbitrum, arbitrumSepolia } from 'viem/chains';

export const LOCAL_CHAIN_ID = 31337;

const isDevelopment = import.meta.env.VITE_ENV === 'development';
const isProduction = import.meta.env.VITE_ENV === 'production';

const forkingNetwork = {
  ...arbitrum,
  id: LOCAL_CHAIN_ID,
  name: 'localhost',
  rpcUrls: {
    public: {
      http: ['http://localhost:8545/'],
      webSocket: [],
    },
    default: {
      http: ['http://localhost:8545/'],
      webSocket: [],
    },
  },
  contracts: {
    ...arbitrum.contracts,
    multicall3: {
      address: arbitrum.contracts.multicall3.address,
      blockCreated: 0,
    },
  },
} as Chain;

const chains: Chain[] = [
  ...(isDevelopment ? [forkingNetwork] : []),
  ...(isProduction ? [arbitrum] : []),
  arbitrumSepolia,
];

export const SUPPORTED_CHAINS = chains as [Chain, ...Chain[]];

export enum ChainId {
  LOCALHOST = LOCAL_CHAIN_ID,
  ARBITRUM = 42161,
  ARBITRUM_SEPOLIA = 421614,
}

export const l2ToL1Chains: Record<
  Exclude<ChainId, ChainId.LOCALHOST>,
  number
> = {
  [ChainId.ARBITRUM]: 1,
  [ChainId.ARBITRUM_SEPOLIA]: 11155111,
};
