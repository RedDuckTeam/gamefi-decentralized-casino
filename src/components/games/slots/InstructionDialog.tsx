import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  slotsInstructionConfig,
  winningSlotsCombinations,
} from '@/constants/slots';
import { cn } from '@/lib/utils';

import './styles.css';

export default function InstructionDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen(open: boolean): void;
}) {
  return (
    <Dialog open={open}>
      <DialogContent
        hideClose
        onInteractOutside={() => setOpen(false)}
        className="flex max-h-[80%] min-w-[640px] max-w-[640px] flex-col gap-4 rounded-[16px] border-0 bg-[#272b3f] p-6 text-white"
      >
        <DialogPrimitive.Close
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-6 w-6 text-text" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        <div className="flex w-full items-center">
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent from-20% to-[#434B71]" />
          <h2 className="px-16 text-base font-semibold text-[#f1f1f1]">
            Game Bonuses
          </h2>
          <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent from-20% to-[#434B71]" />
        </div>
        <div className="slot-rules flex flex-col overflow-auto overflow-x-hidden pr-2">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-4">
              {slotsInstructionConfig.map(
                ({ image, alt, combinations }, index) => (
                  <div
                    key={alt + index}
                    className="flex items-start justify-between gap-4 rounded-[22px] bg-[#070513] p-4"
                  >
                    <img className="" src={image} alt={alt} />
                    <div className="flex flex-col gap-1">
                      {Object.entries(combinations).map(
                        ([combination, win], index) => (
                          <div
                            key={combination + win + index}
                            className="flex gap-6"
                          >
                            <span className="text-base font-bold">
                              {combination}
                            </span>
                            <span className="min-w-[60px] rounded-[12px] bg-[#272B3F] px-2 py-0.5 text-end text-sm">
                              {win}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="flex w-full items-center">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent from-20% to-[#434B71]" />
              <h2 className="px-16 text-base font-semibold text-[#f1f1f1]">
                Ways to win
              </h2>
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent from-20% to-[#434B71]" />
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm text-text">
                Dive into a pool of possibilities, with combinations that pave
                multiple paths to success.
              </p>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {winningSlotsCombinations.map((grid, g_index) => (
                <div
                  key={g_index}
                  className="mx-auto flex w-fit flex-col gap-0.5 rounded-[13px] bg-[#070513] p-2"
                >
                  {grid.map((row, r_index) => (
                    <div key={g_index + r_index} className="flex w-fit gap-0.5">
                      {row.map((cell, c_index) => (
                        <div
                          key={g_index + r_index + c_index}
                          className={cn(
                            'h-4 w-4 rounded-[5px]',
                            cell ? 'bg-[#9747FF]' : 'bg-[#272B3F]',
                          )}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
