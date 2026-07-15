import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useWalletClient } from 'wagmi';

import { apiGetAdmin } from '@/api/admin';
import { AdminManagement } from '@/components/admin/admin-management/admin-management.tsx';
import { Games } from '@/components/admin/games/games.tsx';
import { Referrals } from '@/components/admin/referrals/referrals.tsx';
import { Vip } from '@/components/admin/vip/vip.tsx';
import { Tabs } from '@/components/tabs.tsx';
import { useTokenCookie } from '@/hooks/admin/useTokenCookie';
import { useToast } from '@/hooks/useToast';

export const AdminPage = () => {
  const { address } = useAccount();
  const navigate = useNavigate();
  const { data: walletClient } = useWalletClient();
  const { toast } = useToast();
  const { getOrCreateToken, deleteToken } = useTokenCookie();

  const [isAllowed, setIsAllowed] = useState(false);

  const restrictAccess = useCallback(() => {
    toast({ description: 'You have no access!', variant: 'destructive' });
    navigate('/');
  }, [navigate, toast]);

  useEffect(() => {
    if (!address) return restrictAccess();
    if (!walletClient) return;

    const auth = async () => {
      const token = await getOrCreateToken();
      const response = await apiGetAdmin(address, token);

      if (response.data === true) {
        setIsAllowed(true);
      } else {
        restrictAccess();
      }
    };

    auth().catch(() => {
      restrictAccess();
    });
  }, [address, getOrCreateToken, navigate, restrictAccess, walletClient]);

  useEffect(() => {
    return () => deleteToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isAllowed ? (
    <div className="m-5 flex flex-col gap-5 rounded-[12px] border-[1px] [&_input]:text-black [&_select]:text-black">
      <Tabs
        tabs={[
          { component: <AdminManagement />, name: 'Admin Management' },
          { component: <Vip />, name: 'Vip' },
          { component: <Referrals />, name: 'Referrals' },
          { component: <Games />, name: 'Game Management' },
        ]}
      />
    </div>
  ) : (
    <></>
  );
};
