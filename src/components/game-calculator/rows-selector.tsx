import React, { useCallback, memo } from 'react';

import { Button } from '../ui/button';

import { type TPinLines } from '@/components/games/plinko/config.ts';
import { allowRows } from '@/components/games/plinko/constants.ts';

type Rows = TPinLines;

interface RowsSelectorProps {
  rows: Rows;
  setRows: (rows: TPinLines) => void;
}

export const RowsSelector: React.FC<RowsSelectorProps> = memo(
  ({ rows, setRows }) => {
    const handleSetMode = useCallback(
      (newMode: Rows) => {
        setRows(newMode);
      },
      [setRows],
    );

    return (
      <div className="flex flex-col gap-3">
        <h5 className="text-center text-[12px] font-bold text-text">
          Amount of Rows
        </h5>
        <div className="flex justify-center gap-2 [&_button]:w-1/4">
          {allowRows.map((allowRowsNum) => {
            return (
              <Button
                key={allowRowsNum}
                onClick={() => handleSetMode(allowRowsNum)}
                size="sm"
                colors={rows === allowRowsNum ? 'primary' : 'inactive'}
              >
                {allowRowsNum}
              </Button>
            );
          })}
        </div>
      </div>
    );
  },
);
