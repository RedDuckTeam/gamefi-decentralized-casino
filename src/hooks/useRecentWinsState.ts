import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { WheelVariant } from '@/constants/wheel.ts';
import { type CoinflipHistory } from '@/pages/coinflip.tsx';
import { type DiceGameResult } from '@/pages/dice.tsx';
import { type ILimboPreviousBet } from '@/pages/limbo.tsx';
import { type RpsHistory } from '@/pages/rock-paper-scissors.tsx';
import { type SlideHistory } from '@/pages/slide.tsx';
import type { RouletteNumber } from '@/types/roulette.ts';

interface RecentWinsState {
  // roulette
  rouletteRecentWins: RouletteNumber[];
  setRouletteRecentWins: (numbers: RouletteNumber[]) => void;
  getRouletteRecentWins: () => RouletteNumber[];

  // wheel
  wheelRecentWins: WheelVariant[];
  setWheelRecentWins: (numbers: WheelVariant[]) => void;
  getWheelRecentWins: () => WheelVariant[];

  // dice
  diceRecentWins: DiceGameResult[];
  setDiceRecentWins: (numbers: DiceGameResult[]) => void;
  getDiceRecentWins: () => DiceGameResult[];

  // coinFlip
  coinFlipRecentWins: CoinflipHistory[];
  setCoinFlipRecentWins: (numbers: CoinflipHistory[]) => void;
  getCoinFlipRecentWins: () => CoinflipHistory[];

  // limbo
  limboRecentWins: ILimboPreviousBet[];
  setLimboRecentWins: (numbers: ILimboPreviousBet[]) => void;
  getLimboRecentWins: () => ILimboPreviousBet[];

  // slide
  slideRecentWins: SlideHistory[];
  setSlideRecentWins: (numbers: SlideHistory[]) => void;
  getSlideRecentWins: () => SlideHistory[];

  // rps
  rpsRecentWins: RpsHistory[];
  setRpsRecentWins: (numbers: RpsHistory[]) => void;
  getRpsRecentWins: () => RpsHistory[];
}

export const useRecentWinsStore = create<RecentWinsState>()(
  persist(
    (set, get) => ({
      // roulette
      rouletteRecentWins: [],
      setRouletteRecentWins: (numbers) =>
        set(() => ({ rouletteRecentWins: numbers })),
      getRouletteRecentWins: () => get().rouletteRecentWins,
      // wheel
      wheelRecentWins: [],
      setWheelRecentWins: (numbers) =>
        set(() => ({ wheelRecentWins: numbers })),
      getWheelRecentWins: () => get().wheelRecentWins,
      // dice
      diceRecentWins: [],
      setDiceRecentWins: (numbers) => set(() => ({ diceRecentWins: numbers })),
      getDiceRecentWins: () => get().diceRecentWins,
      // coinFlip
      coinFlipRecentWins: [],
      setCoinFlipRecentWins: (numbers) =>
        set(() => ({ coinFlipRecentWins: numbers })),
      getCoinFlipRecentWins: () => get().coinFlipRecentWins,
      // limbo
      limboRecentWins: [],
      setLimboRecentWins: (numbers) =>
        set(() => ({ limboRecentWins: numbers })),
      getLimboRecentWins: () => get().limboRecentWins,
      // slide
      slideRecentWins: [],
      setSlideRecentWins: (numbers) =>
        set(() => ({ slideRecentWins: numbers })),
      getSlideRecentWins: () => get().slideRecentWins,
      // rps
      rpsRecentWins: [],
      setRpsRecentWins: (numbers) => set(() => ({ rpsRecentWins: numbers })),
      getRpsRecentWins: () => get().rpsRecentWins,
    }),
    {
      name: 'recent-wins',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
