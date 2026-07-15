import { type FC } from 'react';

import { cn } from '@/lib/utils.ts';

interface ButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input: FC<ButtonProps> = ({ error, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <input
        {...props}
        className={cn('w-full rounded-sm px-2 py-1', className)}
      />
      <div className="text-xs text-red-400">{error}</div>
    </div>
  );
};
