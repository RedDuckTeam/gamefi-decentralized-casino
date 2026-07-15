import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { zeroAddress, zeroHash } from 'viem';
import { useAccount, useChainId, useReadContract } from 'wagmi';

import { referralStorageAbi } from '@/abi/referralStorageAbi';
import { getContractAddresses } from '@/constants/contracts';
import {
  requestCodeStats,
  requestUserCodes,
} from '@/lib/graph/request-queries';
import { decodeReferralCode } from '@/lib/referral-code';

export const useGetReferralCode = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { referralStorage } = getContractAddresses(chainId);

  const { data: activatedReferralCode } = useReadContract({
    abi: referralStorageAbi,
    address: referralStorage,
    functionName: 'getTraderReferralInfo',
    args: [address ?? zeroAddress],
    query: { enabled: Boolean(address), refetchInterval: 5_000 },
  });

  const decodedActivatedCode = useMemo(
    () =>
      activatedReferralCode?.[0] !== zeroHash
        ? decodeReferralCode(activatedReferralCode?.[0]?.toString() ?? '')
        : '',
    [activatedReferralCode],
  );

  const { data: userCodes } = useQuery({
    queryKey: ['userCodes'],
    queryFn: async () => await requestUserCodes(address),
    refetchInterval: 5 * 1000, // 5 secs
    initialData: [],
  });

  const { data: codeStats } = useQuery({
    queryKey: ['codeStats'],
    queryFn: async () => await requestCodeStats(address),
    refetchInterval: 5 * 1000, // 5 secs
    initialData: [],
  });

  const { data: referrerTier } = useReadContract({
    abi: referralStorageAbi,
    address: referralStorage,
    functionName: 'referrerTiers',
    args: [activatedReferralCode?.[1] ?? zeroAddress],
    query: { enabled: Boolean(address), refetchInterval: 5_000 },
  });

  return {
    code: decodedActivatedCode,
    referrer: activatedReferralCode?.[1],
    referrerTier,
    userCodes,
    codeStats,
  };
};
