import { type Address } from 'viem';
import { useReadContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi';

export const useGameStarted = (gameAddress: Address, userAddress: Address) => {
  const { data: gameIsStarted } = useReadContract({
    abi: gameAbi,
    address: gameAddress,
    functionName: 'gameStarted',
    args: [userAddress],
  });

  return !!gameIsStarted;
};
