import { useCallback } from 'react';
import { zeroAddress, zeroHash } from 'viem';
import { useChainId, usePublicClient, useWriteContract } from 'wagmi';

import { useToast } from './useToast';

import { referralStorageAbi } from '@/abi/referralStorageAbi';
import { getContractAddresses } from '@/constants/contracts';
import { encodeReferralCode } from '@/lib/referral-code';

export const useRegisterReferralCode = () => {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { toast } = useToast();
  const { referralStorage } = getContractAddresses(chainId);

  const { writeContractAsync } = useWriteContract();

  const generateReferralCode = useCallback(
    async (referralCode: string) => {
      if (!publicClient) return null;

      const encodedCode = encodeReferralCode(referralCode);

      const codeOwner = await publicClient.readContract({
        abi: referralStorageAbi,
        functionName: 'codeOwners',
        address: referralStorage,
        args: [encodedCode],
      });
      if (codeOwner !== zeroAddress) {
        toast({
          description: 'Code already exists.',
          variant: 'destructive',
        });
      }

      if (encodedCode === zeroHash) {
        toast({
          description: 'Invalid code.',
          variant: 'destructive',
        });
      }

      const hash = await writeContractAsync({
        abi: referralStorageAbi,
        functionName: 'registerCode',
        address: referralStorage,
        args: [encodedCode],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      return encodedCode;
    },
    [publicClient, referralStorage, writeContractAsync, toast],
  );

  return {
    generateReferralCode,
  };
};
