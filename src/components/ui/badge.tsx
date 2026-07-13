import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'rounded-[16px] px-3 py-1.5 bg-[#070513] border border-[#070513] flex items-center justify-center text-sm font-medium',
        success:
          'rounded-[16px] px-3 py-1.5 bg-success border border-success flex items-center justify-center text-sm font-medium',
        candy:
          'rounded-[16px] px-3 py-1.5 bg-[#F355DF] border border-[#F355DF] flex items-center justify-center text-sm text-white font-medium',
        donut:
          'rounded-[16px] px-3 py-1.5 bg-[#272B3F] border border-[#272B3F] flex items-center justify-center text-sm text-white font-medium',
        choco:
          'rounded-[16px] px-3 py-1.5 bg-[#FFF73E] border border-[#FFF73E] flex items-center justify-center text-sm text-[#272B3F] font-medium',
        banana:
          'rounded-[16px] px-3 py-1.5 bg-[#33d774] border border-[#33d774] flex items-center justify-center text-sm text-white font-medium',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'rounded-[16px] px-3 py-1.5 bg-danger border border-danger flex items-center justify-center text-sm font-medium',
        outline: 'text-foreground',
        // Roulette variants
        red: 'rounded-[16px] px-3 py-1.5 bg-[#9747ff] border border-[#9747ff] flex items-center justify-center text-sm font-medium',
        black:
          'rounded-[16px] px-3 py-1.5 bg-[#272b3f] border border-[#272b3f] flex items-center justify-center text-sm font-medium',
        green:
          'rounded-[16px] px-3 py-1.5 bg-[#14be7d] border border-[#14be7d] flex items-center justify-center text-sm font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
