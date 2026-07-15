import { useState } from 'react';
import { parseUnits } from 'viem';

import { Input } from '@/components/admin/components/ui/input.tsx';
import { Button } from '@/components/ui/button';
import { useGames } from '@/hooks/admin/useGames.ts';

export const ChangeMaxBetSize = () => {
  const { changeMaxBetSize } = useGames();
  const [value, setValue] = useState<string>('');

  const handleChange = () => {
    changeMaxBetSize({ args: [parseUnits(value, 18)] });
  };

  return (
    <div className="flex flex-col gap-5 rounded-[12px] border-[1px] border-white p-5">
      <div className="text-2xl">Change Max Bet Size</div>
      <Input
        placeholder="number"
        type="number"
        value={value}
        onChange={(e) => {
          if (+e.target.value < 0 || e.target.value.includes('-')) {
            setValue('0');
          } else {
            setValue(e.target.value);
          }
        }}
      />
      <Button disabled={!value} onClick={handleChange}>
        Change
      </Button>
    </div>
  );
};
