import React, { useCallback, memo } from 'react';

import { Button } from '../ui/button';

enum RiskLevel {
  Low,
  Middle,
  High,
  ExtraHigh,
}

const riskNames = ['Low', ' Middle', 'High', 'Extra High'];

interface RiskSelectorProps {
  risk: RiskLevel;
  setRisk: React.Dispatch<React.SetStateAction<RiskLevel>>;
}

const RiskSelector: React.FC<RiskSelectorProps> = memo(({ risk, setRisk }) => {
  const handleSetMode = useCallback(
    (newMode: RiskLevel) => {
      setRisk(newMode);
    },
    [setRisk],
  );

  return (
    <div className="flex flex-col gap-3">
      <h5 className="text-center text-[12px] font-bold text-text">Risk</h5>
      <div className="flex justify-center gap-2 [&_button]:w-1/4">
        {(Object.keys(RiskLevel) as Array<keyof typeof RiskLevel>)
          .filter((v) => isNaN(Number(v)))
          .map((riskLevel, index) => {
            return (
              <Button
                key={riskLevel}
                onClick={() => handleSetMode(RiskLevel[riskLevel])}
                size="sm"
                colors={risk === RiskLevel[riskLevel] ? 'primary' : 'inactive'}
              >
                {riskNames[index]}
              </Button>
            );
          })}
      </div>
    </div>
  );
});

export { RiskLevel, RiskSelector };
