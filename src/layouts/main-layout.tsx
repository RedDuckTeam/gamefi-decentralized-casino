import { lazy, Suspense, useEffect, useState } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useRouteError,
} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAccount, useChainId, useReadContract } from 'wagmi';

import { vipAbi } from '@/abi/vipAbi';
import {
  apiGetReferralsGreeting,
  type ReferralTier,
} from '@/api/referrals-greeting';
import { apiGetVipGreeting, type VipRank } from '@/api/vip-greeting';
import { ConnectWalletButton } from '@/components/connect-wallet-button';
import Sidebar from '@/components/sidebar';
import { useSidebarStore } from '@/components/sidebar/useSidebarStore.ts';
import { Loader } from '@/components/ui/loader';
import BarsSvg from '@/components/ui/svg/bars.svg';
import LogoSvg from '@/components/ui/svg/logo.svg';
import { getContractAddresses } from '@/constants/contracts';
import { useGetReferralCode } from '@/hooks/useGetReferralCode';
import { cn } from '@/lib/utils.ts';

const ReferralsDialog = lazy(() =>
  import('@/components/ui/referrals-dialog').then((module) => ({
    default: module.ReferralsDialog,
  })),
);
const VipDialog = lazy(() =>
  import('@/components/ui/vip-dialog').then((module) => ({
    default: module.VipDialog,
  })),
);

export const MainLayout = () => {
  const { isOpen, setOpen } = useSidebarStore();
  const chainId = useChainId();
  const { address } = useAccount();
  const { pathname } = useLocation();
  const { referrerTier } = useGetReferralCode();
  const navigate = useNavigate();
  const routerError = useRouteError();

  const { data: userRank } = useReadContract({
    abi: vipAbi,
    address: getContractAddresses(chainId).vip,
    functionName: 'getUserRank',
    args: [address],
  });

  const [vipDialogOpen, setVipDialogOpen] = useState(false);
  const [referralsDialogOpen, setReferralsDialogOpen] = useState(false);

  const handleOpen = () => {
    if (isOpen) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [isOpen]);

  useEffect(() => {
    if (!address) return;

    apiGetVipGreeting(address)
      .then((r) => {
        if (r.data.rank) {
          setVipDialogOpen(true);
        }
      })
      .catch(() => {
        // The greeting endpoint responds with 404 when there is nothing to show
      });

    apiGetReferralsGreeting(address)
      .then((r) => {
        if (r.data.tier) {
          setReferralsDialogOpen(true);
        }
      })
      .catch(() => {
        // The greeting endpoint responds with 404 when there is nothing to show
      });
  }, [address]);

  useEffect(() => {
    const errorMessage = (routerError as { message?: string })?.message;
    const errorMessages = [
      'Failed to fetch dynamically imported module',
      'Importing a module script failed',
    ];

    if (errorMessages.some((message) => errorMessage?.includes(message))) {
      navigate(0);
    }
  }, [navigate, routerError]);

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex h-[91px] items-center gap-4 bg-[#070513] p-2 lg:p-6">
        <button onClick={handleOpen}>
          <img
            src={BarsSvg}
            alt="Menu"
            className="block h-12 w-12 p-2 xl:hidden"
          />
        </button>
        <Link to="/">
          <img src={LogoSvg} alt="Crypto Casino" />
        </Link>
        <div className="ml-auto flex items-center gap-6">
          <ConnectWalletButton />
        </div>
      </div>
      <div className="grid xl:grid-cols-[auto_1fr]">
        <div
          className={cn(
            'absolute z-20 h-[calc(100dvh-91px)] overflow-y-scroll backdrop-blur-2xl xl:relative xl:block xl:h-auto xl:overflow-y-visible',
            isOpen ? 'block' : 'hidden',
          )}
        >
          <Sidebar />
        </div>

        <div
          className={cn(
            'relative z-0 h-full bg-[#0f121d] text-white',
            isOpen && 'blur-sm',
          )}
          onClick={handleClose}
        >
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<></>}>
        <VipDialog
          open={vipDialogOpen}
          setOpen={setVipDialogOpen}
          vipRank={Number(userRank) as VipRank}
        />
      </Suspense>
      <Suspense fallback={<></>}>
        <ReferralsDialog
          open={referralsDialogOpen}
          setOpen={setReferralsDialogOpen}
          referralTier={Number(referrerTier) as ReferralTier}
          isReferralPage={pathname === '/referrals'}
        />
      </Suspense>
    </div>
  );
};
