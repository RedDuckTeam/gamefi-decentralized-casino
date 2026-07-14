import { type FormikHelpers, useFormik } from 'formik';
import { useEffect } from 'react';
import { getAddress } from 'viem';
import { useChainId, useReadContract } from 'wagmi';
import * as Yup from 'yup';

import { vipAbi } from '@/abi/vipAbi.ts';
import { Input } from '@/components/admin/components/ui/input.tsx';
import { Button } from '@/components/ui/button';
import { getContractAddresses, getGames } from '@/constants/contracts.ts';
import { useVip } from '@/hooks/admin/useVip.ts';
import { cn } from '@/lib/utils.ts';

interface ISetRankFee {
  address: string;
  rank: number;
  fee: number;
}

const validationSchema = Yup.object().shape({
  fee: Yup.number()
    .min(0, 'Number must be positive')
    .max(10000)
    .required('Required'),
});

export const SetRankFee = () => {
  const chainId = useChainId();
  const { setRankFee } = useVip();
  const { vip: vipAddress } = getContractAddresses(chainId);
  const games = getGames(chainId);

  const { values, errors, handleChange, setFieldValue, handleSubmit } =
    useFormik({
      initialValues: {
        address: String(games[0].address),
        rank: 0,
        fee: 0,
      },
      validationSchema,
      onSubmit: (
        values: ISetRankFee,
        { setSubmitting }: FormikHelpers<ISetRankFee>,
      ) => {
        setRankFee({
          args: [
            getAddress(values.address),
            Number(values.rank),
            BigInt(values.fee),
          ],
        }).finally(() => {
          setSubmitting(false);
        });
      },
    });

  const { data: rankFee, isFetching } = useReadContract({
    abi: vipAbi,
    functionName: 'getRankFee',
    address: vipAddress,
    args: [getAddress(values.address), Number(values.rank)],
  });

  useEffect(() => {
    if (rankFee !== undefined) {
      setFieldValue('fee', String(rankFee));
    }
  }, [rankFee, setFieldValue]);

  return (
    <div className="flex flex-col gap-5 rounded-[12px] border-[1px] border-white p-5">
      <div className="text-2xl">Set Rank Fee</div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <select
          className="rounded-sm px-2 py-1"
          onChange={handleChange}
          value={values.address}
          name="address"
        >
          {getGames(chainId).map(({ name, address }) => (
            <option key={address} value={address}>
              {name}
            </option>
          ))}
        </select>
        <select
          className="rounded-sm px-2 py-1"
          onChange={handleChange}
          value={values.rank}
          name="rank"
        >
          <option value="0">DEFAULT</option>
          <option value="1">BRONZE</option>
          <option value="2">SILVER</option>
          <option value="3">GOLD</option>
        </select>
        <Input
          className={cn(isFetching && 'animate-pulse')}
          disabled={isFetching}
          onChange={handleChange}
          error={errors.fee}
          value={values.fee}
          type="number"
          id="fee"
          name="fee"
          placeholder="fee"
        />
        <Button disabled={isFetching}>Set</Button>
      </form>
    </div>
  );
};
