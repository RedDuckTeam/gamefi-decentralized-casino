import { type Address } from 'viem';
import { useAccount, useChainId, useWatchContractEvent } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi';

type GameEventName = 'GameStart' | 'GameEnd' | 'Refund';

interface GameEventArgs {
  GameStart: {
    user: Address;
    requestId: bigint;
    betAmount: bigint;
    fee: bigint;
  };
  GameEnd: {
    user: Address;
    requestId: bigint;
    result: boolean;
    randomNumber: bigint;
    secondRandomNumber: bigint;
    userBet: bigint;
    amountPaid: bigint;
  };
  Refund: {
    user: Address;
    requestId: bigint;
    blockNumber: bigint;
  };
}

export type GameEventLogs<name extends GameEventName> = {
  args: GameEventArgs[name];
}[];

interface UserGameEventParams<name extends GameEventName> {
  gameAddress: Address;
  eventName: name;
  onLogs: (logs: GameEventLogs<name>) => void | Promise<void>;
}

/**
 * Watches a game contract event and invokes the callback only when every
 * log in the batch belongs to the connected account.
 */
export const useUserGameEvent = <name extends GameEventName>({
  gameAddress,
  eventName,
  onLogs,
}: UserGameEventParams<name>) => {
  const chainId = useChainId();
  const { address } = useAccount();

  useWatchContractEvent({
    abi: gameAbi,
    address: gameAddress,
    eventName,
    chainId,
    strict: true,
    onLogs: (logs) => {
      // TS cannot narrow wagmi's log type by the generic event name,
      // so the concrete type is restored here in one place.
      const typedLogs = logs as unknown as GameEventLogs<name>;
      if (!typedLogs.every((log) => log.args.user === address)) return;
      void onLogs(typedLogs);
    },
  });
};
