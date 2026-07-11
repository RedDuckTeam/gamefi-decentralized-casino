import { type ContractFunctionArgs } from 'viem';
import { useChainId, useWriteContract } from 'wagmi';

import { vipAbi } from '@/abi/vipAbi.ts';
import { getContractAddresses } from '@/constants/contracts.ts';

type VipArgs<name extends 'setUserRank' | 'setRankFee'> = ContractFunctionArgs<
  typeof vipAbi,
  'nonpayable' | 'payable',
  name
>;

export const useVip = () => {
  const chainId = useChainId();
  const { vip: vipAddress } = getContractAddresses(chainId);
  const { writeContractAsync } = useWriteContract();

  const setUserRank = ({ args }: { args: VipArgs<'setUserRank'> }) =>
    writeContractAsync({
      abi: vipAbi,
      functionName: 'setUserRank',
      address: vipAddress,
      args,
    });

  const setRankFee = ({ args }: { args: VipArgs<'setRankFee'> }) =>
    writeContractAsync({
      abi: vipAbi,
      functionName: 'setRankFee',
      address: vipAddress,
      args,
    });

  return {
    setUserRank,
    setRankFee,
  };
};
