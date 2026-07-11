import { type Address } from 'viem';
import { useWriteContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi';

export const useRefundWrite = (gameAddress: Address, account?: Address) => {
  const { writeContractAsync } = useWriteContract();

  return ({ args }: { args: readonly [bigint] }) =>
    writeContractAsync({
      abi: gameAbi,
      functionName: 'refund',
      address: gameAddress,
      account,
      args,
    });
};
