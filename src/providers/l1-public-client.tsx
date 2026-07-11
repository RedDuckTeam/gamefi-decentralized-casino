import { createPublicClient, http, type PublicClient } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

const clients: Record<number, PublicClient> = {
  [mainnet.id]: createPublicClient({ chain: mainnet, transport: http() }),
  [sepolia.id]: createPublicClient({
    chain: sepolia,
    transport: http('https://ethereum-sepolia-rpc.publicnode.com'),
  }),
};

const l1PublicClient = ({ chainId }: { chainId: number }): PublicClient =>
  clients[chainId] ?? clients[mainnet.id];

export default l1PublicClient;
