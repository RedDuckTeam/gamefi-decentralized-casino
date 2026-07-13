import React, { useCallback, memo } from 'react';

import { Button } from '../ui/button';

enum GameMode {
  Manual = 'manual',
  Auto = 'auto',
}

interface GameModeSelectorProps {
  mode: GameMode;
  setMode: React.Dispatch<React.SetStateAction<GameMode>>;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = memo(
  ({ mode, setMode }) => {
    const handleSetMode = useCallback(
      (newMode: GameMode) => {
        setMode(newMode);
      },
      [setMode],
    );

    return (
      <div className="flex flex-col gap-3">
        <h5 className="text-center text-[12px] font-bold text-text">Mode</h5>
        <div className="flex justify-center gap-2 [&_button]:w-1/4">
          <Button
            className="px-0"
            onClick={() => handleSetMode(GameMode.Manual)}
            size="sm"
            colors={mode === GameMode.Manual ? 'primary' : 'inactive'}
          >
            Manual
          </Button>
          <Button
            onClick={() => handleSetMode(GameMode.Auto)}
            size="sm"
            colors={mode === GameMode.Auto ? 'primary' : 'inactive'}
          >
            Auto
          </Button>
        </div>
      </div>
    );
  },
);

export { GameMode, GameModeSelector };
