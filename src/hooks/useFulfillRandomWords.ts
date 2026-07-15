import { type ContractFunctionArgs } from 'viem';
import { useChainId, useWriteContract } from 'wagmi';

import { vrfCoordinatorMockAbi } from '@/abi/vrfCoordinatorMockAbi';
import { getContractAddresses } from '@/constants/contracts';

type FulfillRandomWordsArgs = ContractFunctionArgs<
  typeof vrfCoordinatorMockAbi,
  'nonpayable' | 'payable',
  'fulfillRandomWordsWithOverride'
>;

/**
 * Local development only: resolves a pending VRF request on the mocked
 * coordinator so games can finish without a live Chainlink VRF.
 */
export const useFulfillRandomWords = () => {
  const chainId = useChainId();
  const { writeContractAsync } = useWriteContract();

  return ({ args }: { args: FulfillRandomWordsArgs }) =>
    writeContractAsync({
      abi: vrfCoordinatorMockAbi,
      functionName: 'fulfillRandomWordsWithOverride',
      address: getContractAddresses(chainId).vrfCoordinatorMock || '0x',
      gas: 2500000n,
      args,
    });
};
