import { Composite, type Engine } from 'matter-js';

import { type TPinLines } from '@/components/games/plinko/config.ts';
import { generateGameMap } from '@/components/games/plinko/utils/generateGameMap.ts';
export const mapInit = (engine: Engine, pinLines: TPinLines) => {
  const { pins } = generateGameMap(pinLines);

  Composite.add(engine.world, pins);
};
