import { AxiosError } from 'axios';
import { getAddress } from 'viem';
import { usePublicClient } from 'wagmi';

import { useAdminRoles } from './useAdminRoles';
import { useTokenCookie } from './useTokenCookie';

import { useToast } from '../useToast';

import { apiDeleteAdmin, apiPostAdmin } from '@/api/admin.ts';

export const useAdminManagement = () => {
  const { getOrCreateToken } = useTokenCookie();
  const { toast } = useToast();
  const publicClient = usePublicClient();
  const { defaultAdminRole, grantRole, revokeRole } = useAdminRoles();

  const addAdmin = async (address: string) => {
    try {
      if (!defaultAdminRole) throw new Error("Can't read default admin role");

      if (!publicClient) throw new Error('Public client is unavailable');

      const mappedAddress = getAddress(address);
      const hash = await grantRole({
        args: [defaultAdminRole, mappedAddress],
      });
      await publicClient.waitForTransactionReceipt({ hash });

      const token = await getOrCreateToken();
      await apiPostAdmin(mappedAddress, token);
    } catch (e) {
      if (e instanceof AxiosError) {
        toast({ description: e.response?.data.message });
      } else if (e instanceof Error) {
        toast({ description: e.message });
      }
    }
  };

  const deleteAdmin = async (address: string) => {
    try {
      if (!defaultAdminRole) throw new Error("Can't read default admin role");

      if (!publicClient) throw new Error('Public client is unavailable');

      const mappedAddress = getAddress(address);
      const hash = await revokeRole({
        args: [defaultAdminRole, mappedAddress],
      });
      await publicClient.waitForTransactionReceipt({ hash });

      const token = await getOrCreateToken();
      await apiDeleteAdmin(mappedAddress, token);
    } catch (e) {
      if (e instanceof AxiosError) {
        toast({ description: e.response?.data.message });
      } else if (e instanceof Error) {
        toast({ description: e.message });
      }
    }
  };

  return { addAdmin, deleteAdmin };
};
