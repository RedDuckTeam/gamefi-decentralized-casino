import { type FC } from 'react';
import { type ClassNameValue } from 'tailwind-merge';
import { type Address } from 'viem';

import SvgLoader from '@/components/ui/svg/spinning-circles.svg';
import { useGameState } from '@/hooks/useGameState.ts';
import { cn } from '@/lib/utils.ts';

interface TransactionInProgress {
  gameAddress: Address;
  className?: ClassNameValue;
}

export const TransactionInProgress: FC<TransactionInProgress> = ({
  gameAddress,
  className,
}) => {
  const { isPlaying } = useGameState({
    gameAddress,
  });

  if (isPlaying) {
    return (
      <div
        className={cn(
          'flex flex-row items-center justify-center gap-4',
          className,
        )}
      >
        <div className="flex justify-center">
          <img className="h-8 w-auto" src={SvgLoader} alt="loader" />
        </div>
        <div>Transaction in progress</div>
      </div>
    );
  }

  return null;
};
