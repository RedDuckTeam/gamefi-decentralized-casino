import { useContext } from 'react';

import { RouletteContext } from '../shared/roulette-context';

import RotateSvg from '@/components/ui/svg/rotate.svg';
import TrashcanSvg from '@/components/ui/svg/trashcan.svg';

export default function RouletteActionButtons() {
  const { cancelLastBet, clear } = useContext(RouletteContext);

  return (
    <div className="flex justify-between gap-8">
      <button
        onClick={cancelLastBet}
        className="flex cursor-pointer items-center gap-2 rounded-[12px] bg-[#272B3F] px-4 py-1 transition-colors hover:bg-[#303447]"
      >
        <img src={RotateSvg} alt="rotate-img" className="h-4 w-4" />
        <span className="text-sm text-text">Undo</span>
      </button>
      <button
        onClick={clear}
        className="flex cursor-pointer items-center gap-2 rounded-[12px] bg-[#272B3F] px-4 py-1 transition-colors hover:bg-[#303447]"
      >
        <img src={TrashcanSvg} alt="rotate-img" className="h-4 w-4" />
        <span className="text-sm text-text">Clear bets</span>
      </button>
    </div>
  );
}
