import { Bodies, Composite, type World } from 'matter-js';

import {
  plinkoConfig,
  plinkoGameConfigPinLines,
  type TPinLines,
} from '@/components/games/plinko/config.ts';

const { worldWidth } = plinkoConfig.size;
const { defaultCategory } = plinkoConfig.collision;

export const addBall = (
  world: World,
  pinLines: TPinLines,
  collisionCategory: number,
) => {
  const { ballSize } = plinkoGameConfigPinLines[pinLines];

  Composite.add(
    world,
    Bodies.circle(worldWidth / 2, 20, ballSize, {
      restitution: 0.5,
      frictionAir: 0,
      collisionFilter: {
        category: collisionCategory,
        mask: defaultCategory | collisionCategory,
      },
      render: {
        fillStyle: '#ffffff',
      },
    }),
  );
};
