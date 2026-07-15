import { type Address } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi';
import { LOCAL_CHAIN_ID } from '@/constants/supported-chains';
import { useFulfillRandomWords } from '@/hooks/useFulfillRandomWords';
import { useUserGameEvent } from '@/hooks/useUserGameEvent';
import { copyArrayNTimes, getMockedRandomNums } from '@/lib/utils';

interface LocalVrfAutoFulfillParams {
  gameAddress: Address;
  /** Upper bound for the mocked random numbers fed to the VRF mock. */
  mockRandomMax: bigint;
  /** How many bets are resolved per round (one random pair per bet). */
  numOfBets: bigint;
}

/**
 * Local development only: when a game round starts on the local fork,
 * immediately resolves it through the mocked VRF coordinator so the game
 * can finish without live Chainlink infrastructure.
 */
export const useLocalVrfAutoFulfill = ({
  gameAddress,
  mockRandomMax,
  numOfBets,
}: LocalVrfAutoFulfillParams) => {
  const chainId = useChainId();
  const fulfillRandomWords = useFulfillRandomWords();

  const { data: vrf } = useReadContract({
    abi: gameAbi,
    address: gameAddress,
    functionName: 'vrf',
  });

  useUserGameEvent({
    gameAddress,
    eventName: 'GameStart',
    onLogs: async (logs) => {
      if (chainId !== LOCAL_CHAIN_ID || !vrf) return;

      const requestId = logs[0].args.requestId;
      if (requestId === undefined) return;

      const [firstNum, secondNum] = getMockedRandomNums(mockRandomMax);
      await fulfillRandomWords({
        args: [
          requestId,
          vrf,
          copyArrayNTimes([firstNum, secondNum], Number(numOfBets)),
        ],
      });
    },
  });
};
