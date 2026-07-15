import { useEffect, useState } from 'react';
import { type Address } from 'viem';
import { useAccount, useReadContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi.ts';
import { useUserGameEvent } from '@/hooks/useUserGameEvent';

interface GameState {
  gameAddress: Address;
}

export const useGameState = (params: GameState) => {
  const { gameAddress } = params;
  const { address } = useAccount();

  const [isPlaying, setPlaying] = useState<boolean>(false);

  const { data: isGameStarted, refetch } = useReadContract({
    abi: gameAbi,
    address: gameAddress,
    functionName: 'gameStarted',
    args: [address || '0x'],
  });

  useEffect(() => {
    setPlaying(isGameStarted || false);
  }, [isGameStarted]);

  const syncPlayingState = (optimisticValue: boolean) => {
    setPlaying(optimisticValue);
    refetch().then((result) => setPlaying(result.data || false));
  };

  useUserGameEvent({
    gameAddress,
    eventName: 'GameStart',
    onLogs: () => syncPlayingState(true),
  });

  useUserGameEvent({
    gameAddress,
    eventName: 'GameEnd',
    onLogs: () => syncPlayingState(false),
  });

  useUserGameEvent({
    gameAddress,
    eventName: 'Refund',
    onLogs: () => syncPlayingState(false),
  });

  return { isPlaying };
};
