import { useState } from 'react';
import useSWR from 'swr';
import { erc20Abi, getAddress, parseUnits, zeroAddress } from 'viem';
import { useReadContracts } from 'wagmi';

import { graphFetcher } from '@/api/graph';
import { Input } from '@/components/admin/components/ui/input.tsx';
import { TokenSelect } from '@/components/token-select';
import { Button } from '@/components/ui/button';
import { useGames } from '@/hooks/admin/useGames.ts';
import { getAllowedTokens } from '@/lib/graph/queries/getAllowedTokens';
import { type GameName } from '@/lib/graph/queries/types';
import { type AllowedToken } from '@/lib/graph/types';

export const WithdrawTokens = ({ name }: { name: GameName }) => {
  const { withdrawTokens } = useGames();
  const [value, setValue] = useState<string>('');
  const [tokenAddress, setTokenAddress] = useState<string>(zeroAddress);

  const { data: allowedTokens, isLoading: isLoadingAllowedTokens } = useSWR(
    {
      query: getAllowedTokens(name),
      fetchPolicy: 'network-only',
    },
    graphFetcher,
  );

  const allowedTokensMapped = allowedTokens?.data[name + 'TokenAlloweds'];

  const { data: tokenSymbols, isLoading } = useReadContracts({
    contracts: allowedTokensMapped?.map((t: AllowedToken) => ({
      abi: erc20Abi,
      address: getAddress(t.tokenAddress),
      functionName: 'symbol',
    })),
    allowFailure: false,
  });

  const handleChange = () => {
    if (tokenAddress === zeroAddress) {
      return;
    }

    withdrawTokens({ args: [parseUnits(value, 18), getAddress(tokenAddress)] });
  };

  return (
    <div className="flex flex-col gap-5 rounded-[12px] border-[1px] border-white p-5">
      <div className="text-2xl">Withdraw Tokens</div>
      <TokenSelect
        tokens={allowedTokens?.data[name + 'TokenAlloweds'].map(
          (t: AllowedToken, i: number) => {
            const symbol = tokenSymbols?.[i];

            return {
              address: t.tokenAddress,
              symbol,
            };
          },
        )}
        isLoading={isLoadingAllowedTokens && isLoading}
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <Input
        placeholder="number"
        type="number"
        value={value}
        onChange={(e) => {
          if (+e.target.value < 0 || e.target.value.includes('-')) {
            setValue('0');
          } else {
            setValue(e.target.value);
          }
        }}
      />
      <Button disabled={!value} onClick={handleChange}>
        Withdraw
      </Button>
    </div>
  );
};
