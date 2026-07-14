import WheelRoulette from './wheel-roulette';

import {
  type WheelVariant,
  wheelOddsAndPayouts,
  wheelVariants,
  type WheelRisk,
} from '@/constants/wheel';

interface WheelGameProps {
  selectedRisks: WheelRisk;
  selectedVariant: WheelVariant | null;
  betId: number;
  localBetId: number;
  isWin: boolean | null;
}

export default function WheelGame({
  selectedRisks,
  selectedVariant,
  betId,
  localBetId,
  isWin,
}: WheelGameProps) {
  return (
    <div className="relative flex h-[635px] items-center justify-center rounded-[18px] text-4xl font-bold">
      <img
        src="/games/wheel-game.webp"
        className="image-container z-0 blur-[2px]"
        alt="bg"
      />
      <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden px-3 pb-16">
        <WheelRoulette
          selectedVariant={selectedVariant}
          selectedRisks={selectedRisks}
          betId={betId}
          localBetId={localBetId}
          isWin={isWin}
        />
        <div className="flex gap-2 pt-[450px]">
          {Object.entries(wheelOddsAndPayouts[selectedRisks]).map(
            ([variant, payout]) => {
              const variantInfo = wheelVariants[variant as WheelVariant];
              const { bgColor, id, img, textColor } = variantInfo;

              return (
                <div
                  className="flex flex-col gap-2 rounded-[26px] bg-[#070513] p-4"
                  key={id}
                >
                  <div className="px-2">
                    <div
                      className="flex items-center justify-center rounded-[26px] p-3"
                      style={{ background: bgColor }}
                    >
                      <img src={img} alt={variant} className="w-10" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h6 className="text-center text-[16px] font-bold capitalize text-text">
                      {variant}
                    </h6>
                    <div
                      className="flex items-center rounded-[12px] px-3 py-1"
                      style={{ background: bgColor, color: textColor }}
                    >
                      <p className="mx-auto text-[14px] leading-none">
                        {payout}x
                      </p>
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}
