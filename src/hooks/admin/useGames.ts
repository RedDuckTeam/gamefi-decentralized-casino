import { type ContractFunctionArgs, type ContractFunctionName } from 'viem';
import { useAccount, useWriteContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi.ts';
import { useAdminStore } from '@/hooks/admin/useAdminStore.ts';

type GameFunctionName = ContractFunctionName<
  typeof gameAbi,
  'nonpayable' | 'payable'
>;

type GameArgs<name extends GameFunctionName> = ContractFunctionArgs<
  typeof gameAbi,
  'nonpayable' | 'payable',
  name
>;

export const useGames = () => {
  const gameAddress = useAdminStore((state) => state.activeAddress);
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const changeMaxBetSize = ({ args }: { args: GameArgs<'changeMaxBetSize'> }) =>
    writeContractAsync({
      abi: gameAbi,
      functionName: 'changeMaxBetSize',
      address: gameAddress,
      args,
    });

  const changeMinBetSize = ({ args }: { args: GameArgs<'changeMinBetSize'> }) =>
    writeContractAsync({
      abi: gameAbi,
      functionName: 'changeMinBetSize',
      address: gameAddress,
      args,
    });

  const changeMaxBetCounts = ({
    args,
  }: {
    args: GameArgs<'changeMaxBetCounts'>;
  }) =>
    writeContractAsync({
      abi: gameAbi,
      functionName: 'changeMaxBetCounts',
      address: gameAddress,
      args,
    });

  const changeBlocksToRefund = ({
    args,
  }: {
    args: GameArgs<'changeBlocksToRefund'>;
  }) =>
    writeContractAsync({
      abi: gameAbi,
      functionName: 'changeBlocksToRefund',
      address: gameAddress,
      args,
    });

  const withdrawTokens = ({ args }: { args: GameArgs<'withdrawTokens'> }) =>
    writeContractAsync({
      abi: gameAbi,
      functionName: 'withdrawTokens',
      address: gameAddress,
      account: address,
      args,
    });

  const setGameStarted = ({ args }: { args: GameArgs<'setGameStarted'> }) =>
    writeContractAsync({
      abi: gameAbi,
      functionName: 'setGameStarted',
      address: gameAddress,
      args,
    });

  const setIsTokenAllowed = ({
    args,
  }: {
    args: GameArgs<'setIsTokenAllowed'>;
  }) =>
    writeContractAsync({
      abi: gameAbi,
      functionName: 'setIsTokenAllowed',
      address: gameAddress,
      args,
    });

  return {
    changeMaxBetSize,
    changeMinBetSize,
    changeMaxBetCounts,
    changeBlocksToRefund,
    withdrawTokens,
    setGameStarted,
    setIsTokenAllowed,
  };
};
