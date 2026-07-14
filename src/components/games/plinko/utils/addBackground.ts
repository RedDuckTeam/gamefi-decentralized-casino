import { Bodies, Composite, type Engine } from 'matter-js';

import { plinkoConfig } from '@/components/games/plinko/config.ts';

const { worldWidth } = plinkoConfig.size;
export const addBackground = (engine: Engine) => {
  const gridBackground = Bodies.rectangle(worldWidth / 2, 175, 1, 1, {
    isStatic: true,
    isSensor: true,
    render: {
      sprite: {
        texture: 'game-assets/plinko-bg.webp',
        xScale: 0.49,
        yScale: 0.49,
      },
    },
  });
  Composite.add(engine.world, gridBackground);
};
