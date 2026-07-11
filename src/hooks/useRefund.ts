import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { type Address } from 'viem';
import { useAccount, useChainId, useReadContract } from 'wagmi';

import { useGameStarted } from './useGameStarted';

import { gameAbi } from '@/abi/gameAbi';
import { vrfAbi } from '@/abi/vrfAbi';
import { getContractAddresses } from '@/constants/contracts';
import { type ChainId, l2ToL1Chains } from '@/constants/supported-chains';
import { type GameName } from '@/lib/graph/queries/types';
import {
  requestGameEnds,
  requestGameStarts,
  requestRefunds,
} from '@/lib/graph/request-queries';
import { type Refund, type GameEnd, type GameStart } from '@/lib/graph/types';
import l1PublicClient from '@/providers/l1-public-client';

function getOngoingGames(
  arr1: GameStart[],
  arr2: GameEnd[] | null,
  arr3: Refund[] | null,
): GameStart[] {
  if (!arr2 || !arr3) return [];
  return arr1.filter(
    (element1) =>
      !arr2.some((element2) => element1.requestId === element2.requestId) &&
      !arr3.some((element3) => element1.requestId === element3.requestId),
  );
}

export const useRefund = (gameAddress: Address, gameName: GameName) => {
  const { address } = useAccount();
  const chain = useChainId();
  const [blockNumber, setBlockNumber] = useState<bigint>(0n);

  useEffect(() => {
    const chainId = l2ToL1Chains[chain as Exclude<ChainId, ChainId.LOCALHOST>];

    l1PublicClient({ chainId }).getBlockNumber().then(setBlockNumber);

    const unsubscribe = l1PublicClient({ chainId }).watchBlockNumber({
      onBlockNumber: setBlockNumber,
      pollingInterval: 10000,
    });

    return unsubscribe;
  }, [chain]);

  const { data: blocksToRefund } = useReadContract({
    address: gameAddress,
    abi: gameAbi,
    functionName: 'getBlocksToRefund',
    query: { refetchInterval: 5_000 },
  });
  const contractsGameStarted = useGameStarted(gameAddress, address || `0x`);

  const { data: gameStarts } = useQuery({
    queryKey: [`${gameName}-starts`],
    queryFn: async () => await requestGameStarts(gameName, address),
    refetchInterval: 5 * 1000,
    initialData: [],
  });

  const { data: gameEnds } = useQuery({
    queryKey: [`${gameName}-ends`],
    queryFn: async () => await requestGameEnds(gameName, address),
    refetchInterval: 5 * 1000,
    initialData: null,
  });

  const { data: gameRefunds } = useQuery({
    queryKey: [`${gameName}-refunds`],
    queryFn: async () => await requestRefunds(gameName, address),
    refetchInterval: 5 * 1000,
    initialData: null,
  });

  const ongoingGame = getOngoingGames(gameStarts, gameEnds, gameRefunds);

  const { data: requestStatus } = useReadContract({
    abi: vrfAbi,
    address: getContractAddresses(chain).casinoVrf,
    functionName: 'getRequestStatus',
    args: [BigInt(ongoingGame[0]?.requestId || 0)],
    query: { enabled: ongoingGame.length > 0 },
  });

  const startingBlockNumber = useMemo(
    () => requestStatus?.blockNumber,
    [requestStatus],
  );

  const shouldRefund = useMemo(
    () =>
      blockNumber &&
      !!gameEnds &&
      !!gameRefunds &&
      ongoingGame.length > 0 &&
      blockNumber - BigInt(startingBlockNumber ?? blockNumber) >=
        (blocksToRefund ?? 30n) + 5n,
    [
      blockNumber,
      blocksToRefund,
      gameEnds,
      gameRefunds,
      ongoingGame.length,
      startingBlockNumber,
    ],
  );

  return contractsGameStarted && shouldRefund ? ongoingGame[0] : undefined;
};
