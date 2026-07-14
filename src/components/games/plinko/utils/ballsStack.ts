import { type Engine } from 'matter-js';

import type { TPinLines } from '@/components/games/plinko/config.ts';
import { addBall } from '@/components/games/plinko/utils/addBall.ts';
import { generateCollidersForWinNumber } from '@/components/games/plinko/utils/generateCollidersForWinNumber.ts';

export const ballsStack = (rows: TPinLines) => {
  let collisionCategory = 2;

  return (engine: Engine, winNum: number) => {
    generateCollidersForWinNumber({
      winNum,
      engine,
      pinLines: rows,
      collisionCategory,
    });

    addBall(engine.world, rows, collisionCategory);

    if (collisionCategory === 2147483648) {
      collisionCategory = 2;
    }

    collisionCategory *= 2;
  };
};
