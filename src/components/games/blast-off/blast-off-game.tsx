import { useCallback, useEffect, useRef, useState } from 'react';

import { Rate } from './components/Rate';
import { Ruler } from './components/Ruler';

import './blast-off.css';
import { boomAudio, launchAudio } from '@/api/sound.ts';
import trailSvg from '@/components/ui/svg/rocket-trail.svg';

interface DiceGameProps {
  gameIsRunning: boolean;
  isLose: boolean;
  isWin: boolean;
  currentRate: number;
  setIsLose: (value: boolean) => void;
}

export default function BlastOffGame({
  gameIsRunning,
  isLose,
  isWin,
  currentRate,
  setIsLose,
}: DiceGameProps) {
  const [transitionX, setTransitionX] = useState(60);
  const [transitionY, setTransitionY] = useState(20);
  const [pathY, setPathY] = useState(75);
  const [pathX, setPathX] = useState(33);
  const [rotation, setRotation] = useState(70);

  const rocketRef = useRef<HTMLImageElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  const [isCrashed, setIsCrashed] = useState(false);

  const startGame = useCallback(async () => {
    setTransitionX(440);
    setTransitionY(250);

    setIsCrashed(false);

    setRotation(30);
    setPathX(150);
    setPathY(10);
  }, []);

  useEffect(() => {
    if (gameIsRunning) {
      startGame();
      launchAudio.play();
    }

    if (isLose && rocketRef.current && trailRef.current) {
      const { offsetTop, offsetLeft } = rocketRef.current;
      const computedStyle = getComputedStyle(trailRef.current);
      const currentClipPathValue = computedStyle.getPropertyValue('clip-path');
      const clipPath = currentClipPathValue.match(/([\d.]+)%/g);
      if (clipPath) {
        setPathX(parseFloat(clipPath[3].slice(0, clipPath.length - 1)) - 10);
        setPathY(parseFloat(clipPath[0].slice(0, clipPath.length - 1)) - 10);
      }
      setTransitionX(offsetLeft);
      setTransitionY(Math.abs(offsetTop - 653) - 155);
      setTimeout(() => {
        rocketRef.current?.classList.remove('rocket');
        trailRef.current?.classList.remove('trail');
      }, 0);

      setIsCrashed(true);
      boomAudio.play();
      setTimeout(() => {
        rocketRef.current?.classList.remove('rocket');
        trailRef.current?.classList.remove('trail');
        setTransitionX(60);
        setTransitionY(20);
        setRotation(70);
        setPathX(33);
        setPathY(75);
        setTimeout(() => {
          setIsLose(false);
          rocketRef.current?.classList.add('rocket');
          trailRef.current?.classList.add('trail');
        }, 200);
        setIsCrashed(false);
      }, 4 * 1000);
    }

    return () => {
      setIsCrashed(false);
    };
  }, [gameIsRunning, isLose, setIsLose, startGame]);

  return (
    <div className="relative flex h-[653px] flex-col overflow-hidden rounded-[12px] bg-[url('/images/pages/blast-off/game-bg.webp')] bg-cover p-[24px]">
      <Rate isLose={isLose} isWin={isWin} currentRate={currentRate} />
      <div className="pointer-events-none absolute bottom-10 h-full w-14 select-none pb-10">
        <div className="relative h-full overflow-hidden">
          <Ruler gameIsRunning={gameIsRunning} orientation="vertical" />
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-2 h-14 w-full select-none pl-10">
        <div className="relative h-full w-full overflow-hidden">
          <Ruler gameIsRunning={gameIsRunning} orientation="horizontal" />
        </div>
      </div>
      <img
        ref={rocketRef}
        style={{
          transform: `rotate(${rotation}deg)`,
          bottom: transitionY + 'px',
          left: transitionX + 'px',
        }}
        className="rocket pointer-events-none absolute z-20 w-32 select-none"
        src={`/game-assets/${isCrashed ? 'crashed.webp' : 'rocket.gif'}`}
      />
      <div
        ref={trailRef}
        style={{
          clipPath: `polygon(0 ${pathY}%, 0% 100%, ${pathX}% 100%)`,
        }}
        className="trail pointer-events-none absolute bottom-[25px] left-[30px] h-full w-[650px] select-none overflow-hidden "
      >
        <img
          src={trailSvg}
          alt="trail"
          className="absolute bottom-[60px] left-[30px]"
        />
      </div>
    </div>
  );
}
