import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from './button';
import { Dialog, DialogContent } from './dialog';

import { baseWinAudio } from '@/api/sound.ts';
import coinSvg from '@/components/ui/svg/coin.svg';
import { useIsPortrait } from '@/hooks/useIsPortrait.ts';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn, formatWithComma } from '@/lib/utils';

import winImg from '/games/win.webp';

interface WinDialogProps {
  amount: number;
  bet: number;
  open: boolean;
  setOpen(open: boolean): void;
  onClose?(): void;
}

export const WinDialog = ({
  amount,
  bet,
  open,
  setOpen,
  onClose,
}: WinDialogProps) => {
  const { isPortrait } = useIsPortrait();

  useEffect(() => {
    if (open) {
      baseWinAudio.play();
    }
  }, [open]);

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
          isPortrait && isExtraSmall
            ? 'w-[70%]'
            : isPortrait && isSmall
              ? 'w-3/5'
              : isPortrait
                ? 'sm:w-fit'
                : 'max-w-max md:w-max',
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
        <div
          className={cn(
            'flex items-center justify-center',
            isPortrait ? 'flex-col' : 'flex-row',
          )}
        >
          <img className="w-full max-w-[330px]" src={winImg} alt="Win" />
          <div className="flex flex-col gap-4 p-8">
            <p className="text-center text-[16px] font-semibold leading-none text-text">
              You won
            </p>
            <div className="flex items-center justify-center gap-4">
              <img src={coinSvg} alt="coin" />
              <h5 className="bg-gradient-to-r from-[#FFF2AD] to-[#FFBA4E] bg-clip-text text-5xl font-semibold leading-none text-transparent">
                {formatWithComma(amount)}
              </h5>
            </div>
            <div className="flex items-center justify-center gap-2">
              <p className="text-[12px] leading-none text-[#8C98A9]">Bet</p>
              <div className="flex items-center gap-1">
                <img src={coinSvg} alt="coin" className="w-2.5" />
                <p className="text-[12px] font-semibold text-text">
                  {formatWithComma(bet)}
                </p>
              </div>
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
