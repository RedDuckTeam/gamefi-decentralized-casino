import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';

import { Button } from '@/components/ui/button';

export const FirstBlock = () => {
  const { isConnected } = useAccount();
  const { open: openWeb3Modal } = useAppKit();

  return (
    <div className="relative">
      <img
        src="/images/pages/landing/roulette.jpg"
        alt="roulette-bg"
        className="absolute h-full w-full object-cover"
        loading="lazy"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        fetchpriority="high"
      />
      <div className="flex flex-col p-4 text-[#F1F1F1] backdrop-blur-2xl sm:backdrop-blur-none md:p-[80px]">
        <div className="text-[32px] font-semibold">
          Crypto Casino: Your Fully Decentralized Casino
        </div>
        <div className="mt-[16px] max-w-[464px] text-[16px] font-normal">
          Step into the realm of Crypto Casino, where the fusion of
          cryptocurrency and gaming reaches unprecedented heights in a fully
          decentralized environment. We invite you to embark on an electrifying
          journey where every wager, every spin, propels you towards
          exhilarating rewards.
        </div>
        {!isConnected && (
          <div className="mt-[40px] grid max-w-[400px] grid-cols-2 gap-[8px]">
            <Button
              colors="secondary"
              size="lg"
              onClick={() => openWeb3Modal()}
            >
              Connect
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
