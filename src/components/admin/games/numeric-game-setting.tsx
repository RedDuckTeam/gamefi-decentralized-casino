import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi.ts';
import { Input } from '@/components/admin/components/ui/input.tsx';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/hooks/admin/useAdminStore.ts';
import { cn } from '@/lib/utils.ts';

interface NumericGameSettingProps {
  title: string;
  readFunctionName: 'getBlocksToRefund' | 'getMaxBetCount';
  onSubmit: (value: bigint) => Promise<unknown>;
}

/**
 * Admin form for a single numeric game parameter: shows the current
 * on-chain value and submits a new one.
 */
export const NumericGameSetting = ({
  title,
  readFunctionName,
  onSubmit,
}: NumericGameSettingProps) => {
  const gameAddress = useAdminStore((state) => state.activeAddress);
  const [value, setValue] = useState<string>('');

  const { data: currentValue, isFetching } = useReadContract({
    abi: gameAbi,
    functionName: readFunctionName,
    address: gameAddress,
  });

  useEffect(() => {
    if (currentValue !== undefined) {
      setValue(String(currentValue));
    }
  }, [currentValue]);

  return (
    <div className="flex flex-col gap-5 rounded-[12px] border-[1px] border-white p-5">
      <div className="text-2xl">{title}</div>
      <Input
        className={cn(isFetching && 'animate-pulse')}
        disabled={isFetching}
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
      <Button disabled={isFetching} onClick={() => onSubmit(BigInt(value))}>
        Change
      </Button>
    </div>
  );
};
