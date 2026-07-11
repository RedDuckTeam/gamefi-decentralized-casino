import { type ContractFunctionArgs } from 'viem';
import { useChainId, useReadContract, useWriteContract } from 'wagmi';

import { accessControlAbi } from '@/abi/accessControlAbi';
import { getContractAddresses } from '@/constants/contracts';

type RoleArgs<name extends 'grantRole' | 'revokeRole'> = ContractFunctionArgs<
  typeof accessControlAbi,
  'nonpayable' | 'payable',
  name
>;

export const useAdminRoles = () => {
  const chainId = useChainId();
  const { accessControl } = getContractAddresses(chainId);
  const { writeContractAsync } = useWriteContract();

  const { data: defaultAdminRole } = useReadContract({
    abi: accessControlAbi,
    address: accessControl,
    functionName: 'DEFAULT_ADMIN_ROLE',
  });

  const grantRole = ({ args }: { args: RoleArgs<'grantRole'> }) =>
    writeContractAsync({
      abi: accessControlAbi,
      address: accessControl,
      functionName: 'grantRole',
      args,
    });

  const revokeRole = ({ args }: { args: RoleArgs<'revokeRole'> }) =>
    writeContractAsync({
      abi: accessControlAbi,
      address: accessControl,
      functionName: 'revokeRole',
      args,
    });

  return { defaultAdminRole, grantRole, revokeRole };
};
