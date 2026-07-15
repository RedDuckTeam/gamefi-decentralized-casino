import { useAppKit } from '@reown/appkit/react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';

import { Button } from './ui/button';

import { buttonVariants } from '@/components/ui/button/button-variants.ts';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import { type GameStart } from '@/lib/graph/types';
import { cn } from '@/lib/utils.ts';

export default function BetButton({
  minAmount,
  betAmount,
  gameIsRunning,
  refundNeeded,
  onRefund,
  onBet,
  ongoingGame,
  disabled,
  className,
}: {
  minAmount: bigint;
  betAmount: string;
  gameIsRunning: boolean;
  refundNeeded: boolean;
  onRefund: (arg: bigint) => Promise<void>;
  onBet: () => void;
  ongoingGame?: GameStart;
  disabled?: boolean;
  className?: string;
}) {
  const { isConnected } = useAccount();
  const { open: openWeb3Modal } = useAppKit();

  const insufficientBet =
    !betAmount ||
    betAmount === '0' ||
    parseFloat(betAmount) < parseFloat(formatUnits(minAmount, 18));

  const disable = disabled ?? (gameIsRunning || insufficientBet);

  const handleRefund = () => {
    if (ongoingGame) {
      onRefund(BigInt(ongoingGame.requestId));
    }
  };

  if (!isConnected) {
    return (
      <Button
        className={className}
        onClick={() => openWeb3Modal()}
        data-cy="calcConnectWalletBtn"
      >
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
            Place Bet
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
