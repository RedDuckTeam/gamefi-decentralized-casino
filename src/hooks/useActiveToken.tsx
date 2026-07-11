import { useContext } from 'react';

import { TokensContext } from '@/providers/tokens-context';

export const useActiveToken = () => useContext(TokensContext);
