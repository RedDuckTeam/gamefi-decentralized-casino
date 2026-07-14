import { type Reducer } from 'react';

import { chipsSequence, rouletteChipsConfig } from '@/constants/roulette';
import { type ChipValue } from '@/types/roulette';

interface BetState {
  bets: Map<string, ChipValue[]>;
  history: Map<string, ChipValue[]>[];
}

type RouletteAction =
  | { type: 'PLACE_BET'; position: string; selectedChip: ChipValue }
  | { type: 'CANCEL_LAST_BET' }
  | { type: 'CLEAR' };

export const rouletteInitialState: BetState = {
  bets: new Map<string, ChipValue[]>(),
  history: [],
};

export const rouletteReducer: Reducer<BetState, RouletteAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'PLACE_BET': {
      const { position, selectedChip } = action;
      const foundChip = rouletteChipsConfig.find(
        (c) => c.label == selectedChip,
      );

      if (!foundChip) return state;

      const newBets = new Map(state.bets);

      const currentChips = newBets.get(position) || [];
      newBets.set(
        position,
        deduplicateBets([...currentChips], action.selectedChip),
      );

      return {
        bets: newBets,
        history: [...state.history, newBets],
      };
    }

    case 'CANCEL_LAST_BET': {
      if (state.history.length <= 1)
        return { bets: new Map<string, string[]>(), history: [] };

      return {
        bets: state.history[state.history.length - 2],
        history: state.history.slice(0, -1),
      };
    }

    case 'CLEAR':
      return { bets: new Map(), history: [] };

    default:
      return state;
  }
};

function deduplicateBets(
  currentChips: ChipValue[],
  selectedChip: ChipValue,
): ChipValue[] {
  const filteredChips = currentChips.filter((c) => c === selectedChip);
  const chipIndex = chipsSequence.findIndex((c) => c === selectedChip);

  if (filteredChips.length === 9 && chipIndex !== chipsSequence.length - 1) {
    return deduplicateBets(
      [...currentChips.filter((c) => c !== selectedChip)],
      chipsSequence[chipIndex + 1],
    );
  } else {
    return [...currentChips, selectedChip];
  }
}
