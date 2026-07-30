import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { type PropsWithChildren } from 'react';
import { WagmiProvider as WagmiConfigProvider } from 'wagmi';

import { SUPPORTED_CHAINS } from '../constants/supported-chains.ts';

const projectId = import.meta.env.VITE_PROJECT_ID;

const metadata = {
  name: 'Onchain Arcade',
  description:
    'Onchain Arcade — ten casino games settled on-chain with Chainlink VRF',
  url: window.location.origin,
  icons: [],
};

const networks = SUPPORTED_CHAINS;

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  defaultNetwork: networks[networks.length - 1],
  projectId,
  metadata,
});

export const WagmiProvider = ({ children }: PropsWithChildren) => {
  return (
    <WagmiConfigProvider config={wagmiAdapter.wagmiConfig}>
      {children}
    </WagmiConfigProvider>
  );
};
