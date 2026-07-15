import { useReducer } from 'react';

import { rouletteInitialState, rouletteReducer } from './roulette-reducer';

import { type ChipValue } from '@/types/roulette';

const useRoulette = () => {
  const [state, dispatch] = useReducer(rouletteReducer, rouletteInitialState);

  const placeBet = (position: string, selectedChip: ChipValue | null): void => {
    if (!selectedChip) return;
    dispatch({ type: 'PLACE_BET', position, selectedChip });
  };

  const cancelLastBet = (): void => {
    dispatch({ type: 'CANCEL_LAST_BET' });
  };

  const clear = (): void => {
    dispatch({ type: 'CLEAR' });
  };

  return {
    bets: state.bets,
    history: state.history,
    placeBet,
    cancelLastBet,
    clear,
  };
};

export default useRoulette;
