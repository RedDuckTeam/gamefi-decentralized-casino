import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { Button } from './button';
import { Dialog, DialogContent } from './dialog';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

import winImg from '/games/win.webp';

interface DrawDialogProps {
  open: boolean;
  setOpen(open: boolean): void;
  onClose(): void;
}

export const DrawDialog = ({ open, setOpen, onClose }: DrawDialogProps) => {
  const isExtraSmall = useMediaQuery('(max-width: 468px)');
  const isSmall = useMediaQuery('(min-width: 469px) and (max-width: 550px');

  return (
    <Dialog open={open}>
      <DialogContent
        hideClose
        onInteractOutside={() => {
          setOpen(false);
          onClose?.();
        }}
        className={cn(
          'rounded-[17px] border-0 bg-gradient-to-b from-[#473480] to-[#18172D] p-0',
          isExtraSmall ? 'w-[70%]' : isSmall ? 'w-3/5' : 'w-[366px]',
        )}
      >
        <DialogPrimitive.Close
          onClick={() => {
            setOpen(false);
            onClose?.();
          }}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-6 w-6 text-text" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        <div className={cn('flex items-center justify-center', 'flex-col')}>
          <img className="w-full max-w-[330px]" src={winImg} alt="Win" />
          <div className="flex flex-col gap-4 p-6">
            <p className="text-center text-[16px] font-semibold leading-none text-text">
              Close Call! It's a Draw!
            </p>
            <div className="flex flex-col">
              <p className="text-sm text-[rgb(140,152,169)]">
                Keep playing and see if you can claim victory in the next round!
              </p>
              <p className="text-sm text-[rgb(140,152,169)]"> Good luck!</p>
            </div>
            <Button
              onClick={() => {
                onClose?.();
                setOpen(false);
              }}
            >
              Ok
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
