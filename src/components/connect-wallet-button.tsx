'use client';

import { useAppKit } from '@reown/appkit/react';
import { useAccount, useChainId, useReadContract } from 'wagmi';

import { vipAbi } from '@/abi/vipAbi.ts';
import { Button } from '@/components/ui/button';
import bronzeSvg from '@/components/ui/svg/referrals/bronze-icon.svg';
import goldSvg from '@/components/ui/svg/referrals/gold-icon.svg';
import silverSvg from '@/components/ui/svg/referrals/silver-icon.svg';
import { getContractAddresses } from '@/constants/contracts.ts';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

const ranks = {
  0: '',
  1: bronzeSvg,
  2: silverSvg,
  3: goldSvg,
};

export const ConnectWalletButton = () => {
  const chainId = useChainId();
  const { address, isConnected, chain } = useAccount();
  const { open } = useAppKit();
  const isExtraSmall = useMediaQuery('(max-width: 500px)');

  const { data: userRank } = useReadContract({
    abi: vipAbi,
    address: getContractAddresses(chainId).vip,
    functionName: 'getUserRank',
    args: [address],
  });

  const rankImage = ranks[userRank as keyof typeof ranks] || '';

  if (!isConnected || !address) {
    return (
      <Button
        variant="outlined"
        onClick={() => open({ view: 'Connect' })}
        className="text-nowrap border-2 px-3 py-[6px] font-normal text-text shadow-[0px_0px_14px_4px_#7317E9_inset,0px_0px_16px_2px_#7317E9] transition-shadow hover:shadow-[0px_0px_14px_8px_#7317E9_inset,0px_0px_16px_4px_#7317E9] sm:px-6 sm:py-2"
        data-cy="rtCrnCnctWltBtn"
      >
        Connect Wallet
      </Button>
    );
  }

  if (!chain) {
    return (
      <Button
        variant="outlined"
        onClick={() => open({ view: 'Networks' })}
        className="border-2 px-6 py-2 font-normal text-text shadow-[0px_0px_14px_4px_#7317E9_inset,0px_0px_16px_2px_#7317E9] transition-shadow hover:shadow-[0px_0px_14px_8px_#7317E9_inset,0px_0px_16px_4px_#7317E9]"
      >
        Unsupported Network
      </Button>
    );
  }

  return (
    <div className="relative">
      {rankImage && (
        <img
          className={cn(
            'absolute',
            isExtraSmall ? 'left-[18px] top-[-9px]' : 'left-[-9px] top-[-9px]',
          )}
          src={rankImage}
          alt="rank"
        />
      )}
      <appkit-button size="sm" />
    </div>
  );
};
