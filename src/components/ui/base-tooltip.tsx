import { type FC, type PropsWithChildren, useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx';

export const BaseTooltip: FC<PropsWithChildren & { content: JSX.Element }> = ({
  content,
  children,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={open}>
        <TooltipTrigger
          onClick={handleOpen}
          onBlur={handleClose}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent className="bg-white text-[#070513]">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
