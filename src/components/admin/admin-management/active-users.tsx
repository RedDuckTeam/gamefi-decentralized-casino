import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { graphFetcher } from '@/api/graph.ts';
import { Loading } from '@/components/loading.tsx';
import { TokenSelect } from '@/components/token-select.tsx';
import { getActiveUsers } from '@/lib/graph/queries/getActiveUsers.ts';
import { getTokensAlreadyUse } from '@/lib/graph/queries/getTokensAlreadyUse';

interface GameProfit {
  id: string;
  userAddress: string;
  sumOfBets: string;
  sumOfWins: string;
  tokenDecimals: string;
}

export const ActiveUsers = () => {
  const [tokenAddress, setTokenAddress] = useState('0x');

  const {
    data: activeUsers,
    trigger,
    isMutating: isLoadingActiveUsers,
  } = useSWRMutation(
    {
      query: getActiveUsers(),
      fetchPolicy: 'network-only',
      variables: {
        tokenAddress: tokenAddress,
      },
    },
    graphFetcher,
  );

  const { data: tokensAlreadyUse, isLoading: isLoadingTokensAlreadyUse } =
    useSWR(
      {
        query: getTokensAlreadyUse(),
        fetchPolicy: 'network-only',
      },
      graphFetcher,
    );

  useEffect(() => {
    trigger();
  }, [trigger, tokenAddress]);

  return (
    <div className="flex flex-col gap-5 rounded-[12px] border-[1px] border-white p-5">
      <div className="text-2xl">Active Users</div>
      <div>
        <div>Select Token</div>
        <TokenSelect
          isLoading={isLoadingTokensAlreadyUse}
          tokens={tokensAlreadyUse?.data?.tokenAlreadyUses}
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
      </div>

      <div className="flex flex-col overflow-x-scroll">
        <div className="grid grid-cols-1 border-b-[1px] p-1 lg:grid-cols-2">
          <div>User Address</div>
          <div>Sum of bets</div>
        </div>
        <Loading isLoading={isLoadingActiveUsers} isError={false}>
          {activeUsers?.data?.gameProfits.map((profit: GameProfit) => {
            return (
              <div
                key={profit.userAddress}
                className="grid grid-cols-1 border-b-[1px] p-1 lg:grid-cols-2"
              >
                <div>{profit.userAddress}</div>
                <div>
                  {Number(profit.sumOfBets) /
                    10 ** Number(profit.tokenDecimals)}
                </div>
              </div>
            );
          })}
        </Loading>
      </div>
    </div>
  );
};
