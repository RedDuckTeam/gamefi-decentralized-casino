import { useAccount, useChainId, useReadContract } from 'wagmi';

import { vipAbi } from '@/abi/vipAbi';
import { getContractAddresses } from '@/constants/contracts';

export const useVip = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { vip: vipAddress } = getContractAddresses(chainId);

  const { data: vipStatus } = useReadContract({
    abi: vipAbi,
    address: vipAddress,
    functionName: 'getUserRank',
    args: [address],
    query: { refetchInterval: 5_000 },
  });

  return vipStatus;
};
