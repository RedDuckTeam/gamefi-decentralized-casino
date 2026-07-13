import { useAppKit } from '@reown/appkit/react';
import { Children, type ReactNode } from 'react';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/button';

export default function GameSection({ children }: { children?: ReactNode }) {
  const parsedChildren = Children.toArray(children);

  const { isConnected } = useAccount();
  const { open: openWeb3Modal } = useAppKit();

  return (
    <div className="grid min-w-full grid-cols-1 gap-6 1.5xl:grid-cols-10">
      <div className="order-last rounded-[18px] bg-[#070513] p-6 1.5xl:-order-1 1.5xl:col-span-3">
        {isConnected ? (
          parsedChildren[0]
        ) : (
          <div className="flex justify-center">
            <Button
              className="absolute z-10 mx-auto my-auto mt-[100px]"
              onClick={() => openWeb3Modal()}
              data-cy="calcConnectWalletBtn"
            >
              Connect Wallet
            </Button>
            <div className="pointer-events-none blur-sm">
              {parsedChildren[0]}
            </div>
          </div>
        )}
      </div>
      <div className="rounded-[18px] bg-[#121827] 1.5xl:col-span-7">
        {parsedChildren[1] ?? (
          <div className="flex h-[635px] items-center justify-center text-4xl font-bold">
            The game is not ready yet😿
          </div>
        )}
      </div>
    </div>
  );
}
