import { Bodies } from 'matter-js';

import { plinkoConfig } from '@/components/games/plinko/config.ts';

const { defaultCategory } = plinkoConfig.collision;

export const generateCollider = (
  x: number,
  y: number,
  angle: number,
  collisionCategory: number,
) => {
  return Bodies.rectangle(x, y, 10, 600, {
    isStatic: true,
    angle,
    collisionFilter: {
      category: collisionCategory,
      mask: defaultCategory | collisionCategory,
    },
    render: {
      fillStyle: 'transparent',
    },
  });
};
