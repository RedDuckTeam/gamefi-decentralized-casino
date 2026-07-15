import { Engine, Render, Runner, World } from 'matter-js';
import { useEffect, useMemo, useRef } from 'react';

import {
  plinkoConfig,
  plinkoGameConfigPinLines,
} from '@/components/games/plinko/config.ts';
import { usePlinkoStore } from '@/components/games/plinko/hooks/usePlinkoStore.ts';
import { addBackground } from '@/components/games/plinko/utils/addBackground.ts';
import { ballsStack } from '@/components/games/plinko/utils/ballsStack.ts';
import { initGame } from '@/components/games/plinko/utils/init.ts';
import { mapInit } from '@/components/games/plinko/utils/mapInit.ts';
import { cn } from '@/lib/utils.ts';

const { maxViewWidth, width } = plinkoConfig.size;
const scale = width / maxViewWidth / 1.2;
export default function PlinkoGame() {
  // init canvas
  const scene = useRef<HTMLDivElement>(null);
  // init game engine
  const engineRef = useRef<Engine>(Engine.create());

  // global state
  const rows = usePlinkoStore((state) => state.rows);
  const payouts = usePlinkoStore((state) => state.payouts);
  const spawnBall = usePlinkoStore((state) => state.spawnBall);
  const setIsSpawned = usePlinkoStore((state) => state.setIsSpawned);

  // destruct data
  const engine = engineRef.current;
  const { world } = engine;

  // ball spawner logic
  const addBall = useMemo(() => ballsStack(rows), [rows]);

  const { pinSize, pinGap } = plinkoGameConfigPinLines[rows];

  useEffect(() => {
    if (!spawnBall.isSpawned) {
      addBall(engine, spawnBall.winNum);
      setIsSpawned();
    }
  }, [addBall, engine, setIsSpawned, spawnBall]);

  useEffect(() => {
    // init game subEngines
    const { render, runner } = initGame(scene, engine);

    // add plinko background
    addBackground(engine);

    // generate map by rows
    mapInit(engine, rows);

    return () => {
      Render.stop(render);
      World.clear(world, false);
      Engine.clear(engine);
      Runner.stop(runner as Runner);
      render.canvas.remove();
      render.textures = {};
    };
  }, [engine, rows, world]);

  return (
    <div className=" flex h-full flex-col items-center overflow-hidden rounded-[18px] bg-[linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('/game-assets/plinko-second-bg.webp')] bg-cover bg-center pb-5">
      <div
        className="flex h-[250px] scale-50 transform-gpu flex-col items-center justify-center md:h-[500px] md:scale-100"
        ref={scene}
      />
      <div
        className={cn(
          'flex h-[11.65] scale-50 transform-gpu flex-row justify-center md:h-[23.3px] md:scale-100',
        )}
        style={{ gap: `${pinSize * scale}px` }}
      >
        {payouts.map((payout, index) => {
          return (
            <div
              key={index}
              className="flex flex-col items-center"
              style={{
                minWidth: `${pinGap * scale}px`,
              }}
            >
              <div
                className={cn(
                  'flex w-fit items-center justify-center rounded-[8px] bg-[rgba(151,71,255,0.5)] text-[10px]',
                )}
                style={{
                  minWidth: `23.3px`,
                  minHeight: `23.3px`,
                }}
              >
                x{Number(payout) / 10 ** 4}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
