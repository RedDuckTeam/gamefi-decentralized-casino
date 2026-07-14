import {
  type Engine,
  Events,
  type IRunnerOptions,
  Render,
  Runner,
} from 'matter-js';

import { plinkoConfig } from '@/components/games/plinko/config.ts';

interface IModifyRunnerCallback extends IRunnerOptions {
  deltaMin: number;
  fps: number;
}

const {
  width,
  height,
  minViewHeight,
  minViewWidth,
  maxViewWidth,
  maxViewHeight,
} = plinkoConfig.size;
export const initGame = (
  scene: React.RefObject<HTMLDivElement>,
  engine: Engine,
) => {
  const render = Render.create({
    element: scene.current as HTMLDivElement,
    engine: engine,
    options: {
      width,
      height,
      wireframes: false,
      background: 'transparency',
    },
  });
  Render.run(render);

  const runner = Runner.create() as IModifyRunnerCallback;

  // fix 60 fps
  Events.on(runner, 'tick', () => {
    runner.deltaMin = runner.fps > 60 ? 1000 / runner.fps : 1000 / 60;
  });

  Runner.run(runner as Runner, engine);

  Render.lookAt(render, {
    min: { x: minViewWidth, y: minViewHeight },
    max: { x: maxViewWidth, y: maxViewHeight },
  });

  return { render, runner };
};
