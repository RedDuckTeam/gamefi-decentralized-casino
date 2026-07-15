import { Bodies } from 'matter-js';
import type * as Matter from 'matter-js';

import {
  plinkoConfig,
  plinkoGameConfigPinLines,
  type TPinLines,
} from '@/components/games/plinko/config.ts';

type Position = { x: number; y: number };

export type TGameMap = Array<Array<Position>>;

export const generateGameMap = (pinLines: TPinLines) => {
  const { startPins } = plinkoConfig.map;
  const { worldWidth } = plinkoConfig.size;

  const { pinGap, pinSize, marginTop } = plinkoGameConfigPinLines[pinLines];

  const gameMap: TGameMap = [];
  const pins: Matter.Body[] = [];

  for (let l = 0; l < pinLines; l++) {
    const linePins = startPins + l;
    const lineWidth = linePins * pinGap;
    const positions: Array<Position> = [];
    for (let i = 0; i < linePins; i++) {
      const x = (worldWidth + pinGap) / 2 - lineWidth / 2 + i * pinGap;
      const y = marginTop + l * pinGap;
      positions.push({ x, y });
      const pin = Bodies.circle(x, y, pinSize, {
        isStatic: true,
        render: {
          fillStyle: '#4F5677',
        },
      });
      pins.push(pin);
    }
    gameMap.push(positions);
  }

  return { gameMap, pins, pinsConfig: plinkoGameConfigPinLines[pinLines] };
};
