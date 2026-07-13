import { type PropsWithChildren } from 'react';

import { Dialog, DialogContent } from './dialog';

interface BaseDialogProps extends PropsWithChildren {
  open: boolean;
  setOpen(open: boolean): void;
}

export const BaseDialog = ({ open, setOpen, children }: BaseDialogProps) => {
  return (
    <Dialog open={open}>
      <DialogContent
        hideClose
        onInteractOutside={() => setOpen(false)}
        className="rounded-[17px] border-0 bg-gradient-to-b from-[#473480] to-[#18172D] p-0"
      >
        <div className="flex flex-col items-center gap-4 overflow-hidden p-8">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
