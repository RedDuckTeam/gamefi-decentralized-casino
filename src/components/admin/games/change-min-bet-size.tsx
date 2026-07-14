import { type FormikHelpers, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
  erc20Abi,
  formatUnits,
  getAddress,
  parseUnits,
  zeroAddress,
} from 'viem';
import { usePublicClient, useReadContract, useReadContracts } from 'wagmi';
import * as Yup from 'yup';

import { gameAbi } from '@/abi/gameAbi';
import { graphFetcher } from '@/api/graph';
import { Input } from '@/components/admin/components/ui/input.tsx';
import { TokenSelect } from '@/components/token-select';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/hooks/admin/useAdminStore';
import { useGames } from '@/hooks/admin/useGames.ts';
import { getAllowedTokens } from '@/lib/graph/queries/getAllowedTokens';
import { type GameName } from '@/lib/graph/queries/types';
import { type AllowedToken } from '@/lib/graph/types';

interface IChangeMinBetSize {
  number: string;
}

const validationSchema = Yup.object().shape({
  number: Yup.number().min(0, 'Number must be positive').required('Required'),
});

export const ChangeMinBetSize = ({ name }: { name: GameName }) => {
  const client = usePublicClient();
  const { changeMinBetSize } = useGames();
  const gameAddress = useAdminStore((state) => state.activeAddress);
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

  const {
    data: currentMinBetSize,
    isLoading: isMinBetSizeLoading,
    refetch,
  } = useReadContract({
    abi: gameAbi,
    address: gameAddress,
    functionName: 'getMinBetSize',
    args: [getAddress(tokenAddress)],
    query: { enabled: getAddress(tokenAddress) !== zeroAddress },
  });

  const { values, setValues, handleChange, handleSubmit, errors } = useFormik({
    initialValues: {
      number: '',
    },
    validationSchema,
    onSubmit: async (
      values: IChangeMinBetSize,
      { setSubmitting }: FormikHelpers<IChangeMinBetSize>,
    ) => {
      if (!client) {
        setSubmitting(false);
        return;
      }

      const decimals = await client.readContract({
        abi: erc20Abi,
        address: getAddress(tokenAddress),
        functionName: 'decimals',
      });

      changeMinBetSize({
        args: [
          getAddress(tokenAddress),
          parseUnits(values.number.toString(), decimals),
        ],
      }).finally(() => {
        setSubmitting(false);
      });
    },
  });

  useEffect(() => {
    refetch();
  }, [tokenAddress, gameAddress, refetch]);

  useEffect(() => {
    setValues({
      number: currentMinBetSize ? formatUnits(currentMinBetSize, 18) : '0',
    });
  }, [currentMinBetSize, setValues]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-[12px] border-[1px] border-white p-5"
    >
      <div className="text-2xl">Change Min Bet Size</div>
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
        error={errors.number}
        placeholder="number"
        type="number"
        name="number"
        id="number"
        value={values.number}
        onChange={handleChange}
      />
      <Button
        disabled={
          isMinBetSizeLoading || getAddress(tokenAddress) === zeroAddress
        }
      >
        Change
      </Button>
    </form>
  );
};
