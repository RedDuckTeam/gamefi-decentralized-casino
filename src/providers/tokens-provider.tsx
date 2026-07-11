import React, { useState, type ReactNode } from 'react';

import { TokensContext } from './tokens-context';

import { type BetToken } from '@/types/tokens';

interface ActiveTokenProviderProps {
  children: ReactNode;
}

export const TokensProvider: React.FC<ActiveTokenProviderProps> = ({
  children,
}) => {
  const [activeToken, setActiveToken] = useState<BetToken | null>(null);

  return (
    <TokensContext.Provider value={{ activeToken, setActiveToken }}>
      {children}
    </TokensContext.Provider>
  );
};
