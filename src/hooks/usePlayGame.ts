import { useMemo } from 'react';
import {
  type Address,
  erc20Abi,
  maxInt256,
  parseUnits,
  zeroAddress,
} from 'viem';
import {
  useAccount,
  useChainId,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from 'wagmi';

import { useActiveToken } from './useActiveToken';
import { useTokensBalances } from './useTokensBalances';

import { gameAbi } from '@/abi/gameAbi';
import { ibetHelperAbi } from '@/abi/gmxHelperAbi';
import { getContractAddresses } from '@/constants/contracts';
import { getTokensConfig } from '@/constants/tokens';

export const usePlayGame = (gameAddress: Address, betAmount: bigint) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { activeToken } = useActiveToken();
  const publicClient = usePublicClient();
  const { refreshBalances } = useTokensBalances();
  const defaultToken = getTokensConfig(chainId)[0].address;

  const { data: allowance } = useReadContract({
    abi: erc20Abi,
    address: activeToken?.address || defaultToken,
    functionName: 'allowance',
    args: [address as `0x${string}`, gameAddress],
    query: {
      enabled: Boolean(address),
      refetchInterval: 5_000,
    },
  });

  const { data: betFinalFee } = useReadContract({
    abi: gameAbi,
    address: gameAddress,
    functionName: 'getUserFeePercentsByVip',
    args: [address || zeroAddress],
  });

  const finalBetWithFee = useMemo(() => {
    if (!betFinalFee) return betAmount;
    const betFee = (betAmount * betFinalFee) / 10000n;
    return betAmount + betFee;
  }, [betAmount, betFinalFee]);

  const { data: buyOrSellAmount } = useReadContract({
    abi: ibetHelperAbi,
    address: getContractAddresses(chainId).ibetHelper,
    functionName: 'getBuyOrSellAmount',
    args: [activeToken?.address || defaultToken, finalBetWithFee, true],
  });

  const { writeContractAsync } = useWriteContract();

  const getFeeData = async () => {
    if (!publicClient) return {};
    const fees = await publicClient.estimateFeesPerGas();
    // Add 20% buffer so the tx isn't rejected if baseFee ticks up
    return {
      maxFeePerGas:
        fees.maxFeePerGas != null
          ? (fees.maxFeePerGas * 120n) / 100n
          : undefined,
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
    };
  };

  const checkAllowance = async (amount: bigint) => {
    const isAllowanceEnough = allowance ? allowance >= amount : false;
    if (!isAllowanceEnough) {
      const feeData = await getFeeData();
      const hash = await writeContractAsync({
        abi: erc20Abi,
        functionName: 'approve',
        address: activeToken?.address || defaultToken,
        args: [gameAddress, maxInt256],
        ...feeData,
      });
      await publicClient?.waitForTransactionReceipt({ hash });
    }
  };

  const startGame = async (betAmount: bigint | string, data: `0x${string}`) => {
    const slippage = buyOrSellAmount
      ? buyOrSellAmount - (buyOrSellAmount * 2n) / 100n
      : 0n;

    const gameBetAmount =
      typeof betAmount == 'bigint' ? betAmount : parseUnits(betAmount, 18);

    const feeData = await getFeeData();
    const playGameHash = await writeContractAsync({
      abi: gameAbi,
      functionName: 'playGame',
      address: gameAddress,
      args: [
        activeToken?.address || defaultToken,
        gameBetAmount,
        data,
        slippage,
      ],
      ...feeData,
    });
    await publicClient?.waitForTransactionReceipt({ hash: playGameHash });
    await refreshBalances();
  };

  return {
    checkAllowance,
    startGame,
    finalBetWithFee,
  };
};
