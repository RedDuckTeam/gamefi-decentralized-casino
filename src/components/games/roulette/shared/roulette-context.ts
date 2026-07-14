import { createContext } from 'react';

import { rouletteInitialState } from './roulette-reducer';

import { type ChipValue } from '@/types/roulette';

type TRouletteContext = {
  bets: Map<string, ChipValue[]>;
  history: Map<string, string[]>[];
  placeBet: (position: string, selectedChip: ChipValue | null) => void;
  cancelLastBet: () => void;
  clear: () => void;
};

export const RouletteContext = createContext<TRouletteContext>({
  placeBet() {},
  cancelLastBet() {},
  clear() {},
  ...rouletteInitialState,
});
