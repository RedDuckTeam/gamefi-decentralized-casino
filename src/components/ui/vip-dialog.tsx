import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useAccount, useWalletClient } from 'wagmi';

import { Button } from './button';
import { Dialog, DialogContent } from './dialog';

import { apiDeleteVipGreeting, VipRank } from '@/api/vip-greeting';
import { useIsPortrait } from '@/hooks/useIsPortrait.ts';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { signAuthMessage } from '@/lib/sign-auth-message';
import { cn } from '@/lib/utils';

import bronzeCongrats from '/images/pages/vip/bronze-congrats.svg';
import silverCongrats from '/images/pages/vip/silver-congrats.svg';
import goldCongrats from '/images/pages/vip/gold-congrats.svg';

const vipCongratsImgMap = {
  [VipRank.DEFAULT]: '',
  [VipRank.BRONZE]: bronzeCongrats,
  [VipRank.SILVER]: silverCongrats,
  [VipRank.GOLD]: goldCongrats,
};

const vipCongratsTextMap = {
  [VipRank.DEFAULT]: 'Default',
  [VipRank.BRONZE]: 'Bronze',
  [VipRank.SILVER]: 'Silver',
  [VipRank.GOLD]: 'Gold',
};

export const VipDialog = ({
  open,
  vipRank,
  setOpen,
  onClose,
}: {
  open: boolean;
  vipRank: VipRank;
  setOpen(open: boolean): void;
  onClose?(): void;
}) => {
  const { isPortrait } = useIsPortrait();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const isExtraSmall = useMediaQuery('(max-width: 468px)');
  const isSmall = useMediaQuery('(min-width: 469px) and (max-width: 550px');

  const handleClaimVipTier = async () => {
    if (!address || !walletClient) return;
    const token = await signAuthMessage(walletClient);
    await apiDeleteVipGreeting(address, token);
    setOpen(false);
    onClose?.();
  };

  return (
    <Dialog open={open}>
      <DialogContent
        hideClose
        onInteractOutside={() => {
          setOpen(false);
          onClose?.();
        }}
        className={cn(
          'rounded-[17px] border-0 bg-gradient-to-b from-[#473480] to-[#18172D] p-0',
          isPortrait && isExtraSmall
            ? 'w-[82%]'
            : isPortrait && isSmall
              ? 'w-3/5'
              : isPortrait
                ? 'sm:w-fit'
                : 'max-w-max md:w-max',
        )}
      >
        <DialogPrimitive.Close
          onClick={() => {
            setOpen(false);
            onClose?.();
          }}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-6 w-6 text-text" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        <div
          className={cn(
            'flex items-center justify-center',
            isPortrait ? 'flex-col' : 'flex-row',
          )}
        >
          <img
            className="w-full max-w-[330px]"
            src={vipCongratsImgMap[vipRank]}
            alt="Win"
          />
          <div className="flex max-w-[400px] flex-col gap-4 p-3 sm:p-4 md:p-6">
            <h4 className="text-center text-2xl font-semibold leading-none text-text">
              Congratulations!
            </h4>
            <p className="mb-2 text-nowrap text-base text-text">
              You have reached{' '}
              <span className="font-semibold">
                {vipCongratsTextMap[vipRank]}
              </span>{' '}
              VIP Status.
            </p>
            <Button onClick={handleClaimVipTier}>Ok</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
