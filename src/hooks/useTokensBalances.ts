import { useMemo } from 'react';
import { erc20Abi } from 'viem';
import { useAccount, useChainId, useReadContracts } from 'wagmi';

import { getTokenAssetUrl } from '@/constants/assets';
import { type ChainId } from '@/constants/supported-chains';
import { getTokensConfig, type TokenConfig } from '@/constants/tokens';
import { type BetToken } from '@/types/tokens';

type TokenBalancesResponse = {
  tokens: BetToken[];
  refreshBalances: () => Promise<void>;
};

export const useTokensBalances = (): TokenBalancesResponse => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId() as ChainId;

  const tokens = useMemo(() => getTokensConfig(chainId) || [], [chainId]);

  const balanceContractReads = tokens.map((token: TokenConfig) => ({
    abi: erc20Abi,
    address: token.address,
    functionName: 'balanceOf',
    args: [address || ''],
  }));

  const decimalsContractReads = tokens.map((token: TokenConfig) => ({
    abi: erc20Abi,
    address: token.address,
    functionName: 'decimals',
    args: [],
  }));

  const {
    data: balanceData,
    isLoading: balanceLoading,
    error: balanceError,
    refetch: _refreshBalances,
  } = useReadContracts({
    contracts: balanceContractReads,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 5_000,
    },
  });

  const refreshBalances = async () => {
    await _refreshBalances();
  };

  const {
    data: decimalsData,
    isLoading: decimalsLoading,
    error: decimalsError,
  } = useReadContracts({
    contracts: decimalsContractReads,
    query: {
      enabled: isConnected && !!address,
    },
  });

  const result = useMemo(() => {
    if (
      !balanceData ||
      !decimalsData ||
      balanceLoading ||
      decimalsLoading ||
      balanceError ||
      decimalsError
    ) {
      return [];
    }

    return balanceData.map(({ result }, index) => ({
      address: tokens[index].address,
      symbol: tokens[index].symbol,
      icon: getTokenAssetUrl(tokens[index].symbol),
      balance: result as bigint,
      decimals: decimalsData[index].result as number,
    }));
  }, [
    balanceData,
    decimalsData,
    tokens,
    balanceLoading,
    decimalsLoading,
    balanceError,
    decimalsError,
  ]);

  return { tokens: result, refreshBalances };
};
