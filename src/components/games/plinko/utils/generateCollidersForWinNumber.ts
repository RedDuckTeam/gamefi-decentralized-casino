import { Bodies, Composite, type Engine } from 'matter-js';
import * as Matter from 'matter-js';

import { plinkoAudio } from '@/api/sound.ts';
import {
  plinkoConfig,
  plinkoGameConfigPinLines,
  type TPinLines,
} from '@/components/games/plinko/config.ts';
import { generateCollider } from '@/components/games/plinko/utils/generateCollider.ts';
import { generateGameMap } from '@/components/games/plinko/utils/generateGameMap.ts';

const { defaultCategory } = plinkoConfig.collision;
const { worldWidth } = plinkoConfig.size;
interface IGenCollForWinNum {
  winNum: number;
  engine: Engine;
  pinLines: TPinLines;
  collisionCategory: number;
}

export const generateCollidersForWinNumber = (params: IGenCollForWinNum) => {
  const { winNum, engine, pinLines, collisionCategory } = params;

  const { pinGap } = plinkoGameConfigPinLines[pinLines];
  const { gameMap } = generateGameMap(pinLines);

  const gameMapLength = gameMap.length;
  const winNumsLength = gameMap[gameMapLength - 1].length;

  const isRightNum = winNum >= 0 && winNum <= winNumsLength - 2;

  if (!isRightNum) return;

  const xSpace = -136.5;
  const ySpace = 266;
  const pathAngle = 0.463;

  const { x, y } = gameMap[gameMapLength - 1][winNum];

  const rightRectangle = generateCollider(
    x + xSpace,
    y - ySpace,
    -pathAngle,
    collisionCategory,
  );

  const leftRectangle = generateCollider(
    x + xSpace + ySpace + 7 + pinGap,
    y - ySpace,
    pathAngle,
    collisionCategory,
  );

  const floor = Bodies.rectangle(worldWidth / 2, 350, 1000, 10, {
    isStatic: true,
    collisionFilter: {
      category: collisionCategory,
      mask: defaultCategory | collisionCategory,
    },
    render: {
      // fillStyle: 'transparent',
    },
  });
  function cleanerCallback({ pairs }: Matter.IEventCollision<Engine>) {
    plinkoAudio.play();
    pairs.forEach(({ bodyA, bodyB }) => {
      [bodyA, bodyB].forEach((body) => {
        if (body.id === floor.id) {
          Matter.World.remove(engine.world, bodyA);
          Matter.World.remove(engine.world, bodyB);
          Matter.World.remove(engine.world, rightRectangle);
          Matter.World.remove(engine.world, leftRectangle);
          Matter.Events.off(engine, 'collisionEnd', cleanerCallback);
        }
      });
    });
  }

  Matter.Events.on(engine, 'collisionEnd', cleanerCallback);

  Composite.add(engine.world, [rightRectangle, leftRectangle, floor]);
};
