import { type ReactNode } from 'react';

import { RouletteContext } from './roulette-context';
import useRoulette from './useRoulette';

export const RouletteProvider = ({ children }: { children: ReactNode }) => {
  const roulette = useRoulette();

  return (
    <RouletteContext.Provider value={roulette}>
      {children}
    </RouletteContext.Provider>
  );
};
