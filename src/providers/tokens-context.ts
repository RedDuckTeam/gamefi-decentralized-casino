import { createContext } from 'react';

import { type BetToken } from '@/types/tokens';

export type TTokensContext = {
  activeToken: BetToken | null;
  setActiveToken: (token: BetToken | null) => void;
};

export const TokensContext = createContext<TTokensContext>({
  activeToken: null,
  setActiveToken: () => {},
});
