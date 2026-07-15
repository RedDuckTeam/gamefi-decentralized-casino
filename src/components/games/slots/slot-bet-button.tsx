import { useAppKit } from '@reown/appkit/react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';

import { GameMode } from '@/components/game-calculator/mode-selector';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button/button-variants.ts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import { type GameStart } from '@/lib/graph/types';
import { cn } from '@/lib/utils.ts';
import { type SlotsRoundData } from '@/pages/slots';

export default function SlotBetButton({
  numOfBets,
  mode,
  slotsData,
  minAmount,
  betAmount,
  gameIsRunning,
  refundNeeded,
  onRefund,
  onBet,
  ongoingGame,
  className,
}: {
  numOfBets: number;
  mode: GameMode;
  slotsData: SlotsRoundData[];
  minAmount: bigint;
  betAmount: string;
  gameIsRunning: boolean;
  refundNeeded: boolean;
  ongoingGame?: GameStart;
  onRefund: (arg: bigint) => Promise<void>;
  onBet: () => void;
  className?: string;
}) {
  const isManual = mode === GameMode.Manual;

  const { isConnected } = useAccount();
  const { open: openWeb3Modal } = useAppKit();

  const insufficientBet =
    !betAmount ||
    betAmount === '0' ||
    parseFloat(betAmount) < parseFloat(formatUnits(minAmount, 18));

  const handleRefund = () => {
    if (ongoingGame) {
      onRefund(BigInt(ongoingGame.requestId));
    }
  };

  if (!isConnected) {
    return (
      <Button className={className} onClick={() => openWeb3Modal()}>
        Connect Wallet
      </Button>
    );
  }

  if (refundNeeded) {
    return (
      <Button className={className} onClick={handleRefund}>
        Refund
      </Button>
    );
  }

  if (slotsData.length === 0 && numOfBets > 1 && isManual) {
    const disable = gameIsRunning || insufficientBet;

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>
            <div
              className={buttonVariants({
                className: cn(
                  className,
                  disable
                    ? 'pointer-events-none !bg-[#9747FF99] !text-[#F1F1F199]'
                    : '',
                ),
              })}
              onClick={onBet}
            >
              Prepare Bets
            </div>
          </TooltipTrigger>
          <TooltipContent
            className="bg-white text-[#070513]"
            hidden={!insufficientBet || gameIsRunning}
          >
            <p>
              Min bet is {formatUnits(minAmount, 18)}, increase your bet to play
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const noBet =
    !betAmount ||
    parseFloat(betAmount) < parseFloat(formatUnits(minAmount, 18));

  const localStorageGameDisabled = isManual && slotsData.length == 0 && noBet;
  const manualGameDisabled = !isManual && noBet;

  const disable =
    gameIsRunning || localStorageGameDisabled || manualGameDisabled;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={buttonVariants({
              className: cn(
                className,
                disable
                  ? 'pointer-events-none !bg-[#9747FF99] !text-[#F1F1F199]'
                  : '',
              ),
            })}
            onClick={onBet}
          >
            {isManual && slotsData.length !== 0 ? 'Spin' : 'Place Bet'}
          </div>
        </TooltipTrigger>
        <TooltipContent
          className="bg-white text-[#070513]"
          hidden={
            (isManual && slotsData.length !== 0) ||
            (!insufficientBet && !gameIsRunning) ||
            gameIsRunning
          }
        >
          <p>
            Min bet is {formatUnits(minAmount, 18)}, increase your bet to play
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
