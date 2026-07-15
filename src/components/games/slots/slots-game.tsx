import { useState } from 'react';

import InstructionDialog from './InstructionDialog';
import SlotMachine from './slot-machine';

import DocsSvg from '@/components/ui/svg/docs.svg';

export default function SlotsGame({
  roundIsRunning,
  slotsState,
  // recentResult,
}: {
  slotsState: number[][];
  roundIsRunning: boolean;
  recentResult: boolean | null;
}) {
  const [instructionOpen, setInstructionOpen] = useState(false);

  const handleInstructionClick = () => {
    setInstructionOpen(true);
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[18px]">
      <img
        src="/images/pages/slots/game-bg.webp"
        className="image-container opacity-70 blur-[2px]"
        alt="bg"
      />
      <div className="absolute right-5 top-5 z-50 flex gap-1">
        <button
          onClick={handleInstructionClick}
          className="rounded-[16px] bg-[#272b3f] px-3 py-[6px]"
        >
          <img src={DocsSvg} alt="docs-image" />
        </button>
      </div>

      <div className="content-container">
        <SlotMachine slotsState={slotsState} roundIsRunning={roundIsRunning} />
      </div>

      <InstructionDialog open={instructionOpen} setOpen={setInstructionOpen} />
    </div>
  );
}
