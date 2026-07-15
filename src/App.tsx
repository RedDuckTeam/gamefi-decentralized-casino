import { CookiesProvider } from 'react-cookie';
import { RouterProvider } from 'react-router-dom';

import { Toaster } from './components/ui/toaster.tsx';
import { QueryProvider } from './providers/query-provider.tsx';
import { TokensProvider } from './providers/tokens-provider.tsx';
import { WagmiProvider } from './providers/wagmi-provider.tsx';
import { router } from './router/index.tsx';

export const App = () => {
  return (
    <WagmiProvider>
      <QueryProvider>
        <TokensProvider>
          <CookiesProvider>
            <RouterProvider router={router} />
            <Toaster />
          </CookiesProvider>
        </TokensProvider>
      </QueryProvider>
    </WagmiProvider>
  );
};
