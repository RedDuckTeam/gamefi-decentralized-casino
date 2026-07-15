import { useMemo } from 'react';
import { encodeAbiParameters, zeroAddress, type Address } from 'viem';
import { useAccount, useChainId, useReadContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi';
import { type ChainId } from '@/constants/supported-chains';
import { getTokensConfig } from '@/constants/tokens';

type BetAmountsResponse = {
  minAmount: bigint;
  maxAmount: bigint;
};

export const useBetAmounts = (
  token: Address | undefined,
  gameAddress: Address,
  data: `0x${string}`,
): BetAmountsResponse => {
  const chainId = useChainId() as ChainId;
  const { address } = useAccount();
  const tokens = getTokensConfig(chainId);
  const defaultToken = tokens[0].address;

  const { data: minAmount } = useReadContract({
    abi: gameAbi,
    address: gameAddress,
    functionName: 'getMinBetSize',
    args: [token || defaultToken],
  });

  const { data: betFinalFee } = useReadContract({
    abi: gameAbi,
    address: gameAddress,
    functionName: 'getUserFeePercentsByVip',
    args: [address || zeroAddress],
  });

  const { data: rawMaxAmount } = useReadContract({
    abi: gameAbi,
    address: gameAddress,
    functionName: 'getMaxBetSize',
    args: [
      token || defaultToken,
      encodeAbiParameters(
        [
          { name: 'data', type: 'bytes' },
          { name: 'token', type: 'address' },
        ],
        [data, token || defaultToken],
      ),
    ],
  });

  const maxAmount = useMemo(() => {
    if (rawMaxAmount && betFinalFee) {
      return rawMaxAmount - (rawMaxAmount * betFinalFee) / 10000n;
    }
    return 0n;
  }, [betFinalFee, rawMaxAmount]);

  return {
    minAmount: minAmount || 0n,
    maxAmount: maxAmount,
  };
};
