import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { SliderVariant } from '@/constants/dice';
import { cn } from '@/lib/utils';

interface SliderProps {
  variant: SliderVariant;
}

const DiceSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & SliderProps
>(({ className, variant, ...props }, ref) => {
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          'relative h-2 w-full grow overflow-hidden rounded-full transition-colors',
          variant === SliderVariant.OVER ? 'bg-success' : 'bg-danger',
        )}
      >
        <SliderPrimitive.Range
          className={cn(
            'absolute h-full transition-colors',
            variant === SliderVariant.OVER ? 'bg-danger' : 'bg-success',
          )}
        />
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb
        className={cn(
          'block h-5 w-5 cursor-pointer rounded-full border-2 border-primary bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variant === SliderVariant.OVER
            ? 'ring-offset-success'
            : 'ring-offset-danger',
        )}
      />
    </SliderPrimitive.Root>
  );
});
DiceSlider.displayName = 'DiceSlider';

export { DiceSlider };
