import { type ReactNode } from 'react';

import GameDescription from './game-description';
import GameTitle from './game-title';
import HowToPlay, { type HowToPlayStep } from './how-to-play';

export type GameInfoConfig = {
  title: string;
  description: string[];
  image: string;
  imageAlt: string;
  imagePadding?: boolean;
  howToPlaySteps: HowToPlayStep[];
};

export default function GameInfo({
  config,
  children,
}: {
  config: GameInfoConfig;
  children?: ReactNode;
}) {
  const { title, description, image, imageAlt, imagePadding, howToPlaySteps } =
    config;

  return (
    <div className="flex flex-col gap-6">
      <GameTitle title={title} />
      <div className="flex w-full flex-col gap-10 rounded-[40px] bg-[#070513] p-4 lg:p-10">
        <GameDescription
          description={description}
          image={image}
          imagePadding={imagePadding}
          alt={imageAlt}
        />
        <HowToPlay steps={howToPlaySteps} />
        {children}
      </div>
    </div>
  );
}
