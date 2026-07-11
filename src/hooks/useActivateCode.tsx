import { useCallback } from 'react';
import { type Hex } from 'viem';
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWriteContract,
} from 'wagmi';

import { referralStorageAbi } from '@/abi/referralStorageAbi';
import { getContractAddresses } from '@/constants/contracts';

export const useActivateCode = () => {
  const { address: account } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { referralStorage } = getContractAddresses(chainId);
  const { writeContractAsync } = useWriteContract();

  const activateCode = useCallback(
    async (code: Hex) => {
      if (!publicClient) return false;

      const hash = await writeContractAsync({
        abi: referralStorageAbi,
        address: referralStorage,
        functionName: 'setTraderReferralCodeByUser',
        account,
        args: [code],
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return receipt.status === 'success';
    },
    [writeContractAsync, publicClient, referralStorage, account],
  );

  return {
    activateCode,
  };
};
