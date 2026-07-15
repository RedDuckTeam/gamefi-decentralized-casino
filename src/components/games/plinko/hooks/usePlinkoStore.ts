import { create } from 'zustand';

import type { TPinLines } from '@/components/games/plinko/config.ts';

interface ISpawnBallChunk {
  id: number;
  winNum: number;
  isSpawned: boolean;
}
interface PlinkoState {
  rows: TPinLines;
  payouts: bigint[];
  setPayouts: (payouts: bigint[]) => void;
  setRows: (rows: TPinLines) => void;
  spawnBall: ISpawnBallChunk;
  setSpawnBall: (winNum: number) => void;
  setIsSpawned: () => void;
}
export const usePlinkoStore = create<PlinkoState>((set) => ({
  payouts: [],
  setPayouts: (payouts) => set(() => ({ payouts })),
  rows: 8,
  setRows: (rows) => set(() => ({ rows })),
  spawnBall: {
    id: 0,
    winNum: 0,
    isSpawned: true,
  },
  setSpawnBall: (winNum: number) => {
    set((state) => ({
      spawnBall: {
        id: state.spawnBall.id + 1,
        winNum,
        isSpawned: false,
      },
    }));
  },
  setIsSpawned: () => {
    set(({ spawnBall }) => ({
      spawnBall: {
        id: spawnBall.id,
        winNum: spawnBall.winNum,
        isSpawned: true,
      },
    }));
  },
}));
