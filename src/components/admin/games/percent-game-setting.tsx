import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';
import * as Yup from 'yup';

import { gameAbi } from '@/abi/gameAbi.ts';
import { Input } from '@/components/admin/components/ui/input.tsx';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/hooks/admin/useAdminStore.ts';

const validationSchema = Yup.object().shape({
  percent: Yup.number()
    .min(0.01, 'Number must be greater than 0.01')
    .max(100)
    .required('Required'),
});

interface PercentGameSettingProps {
  title: string;
  readFunctionName: 'getBetFeePercents' | 'getHouseEdge';
  writeFunctionName: 'changeBetFeePercents' | 'changeHouseEdge';
}

/**
 * Admin form for a percent-based game parameter. On-chain the value is
 * stored in basis points, hence the x100 conversion both ways.
 */
export const PercentGameSetting = ({
  title,
  readFunctionName,
  writeFunctionName,
}: PercentGameSettingProps) => {
  const gameAddress = useAdminStore((state) => state.activeAddress);
  const { writeContractAsync } = useWriteContract();

  const {
    data: currentValue,
    isFetching,
    refetch,
  } = useReadContract({
    abi: gameAbi,
    functionName: readFunctionName,
    address: gameAddress,
  });

  const { handleSubmit, values, setValues, handleChange, errors } = useFormik({
    initialValues: {
      percent: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      writeContractAsync({
        abi: gameAbi,
        functionName: writeFunctionName,
        address: gameAddress,
        args: [BigInt(values.percent * 100)],
      });
    },
  });

  useEffect(() => {
    refetch();
  }, [gameAddress, refetch]);

  useEffect(() => {
    setValues({
      percent: currentValue ? parseInt(currentValue.toString()) / 100 : 0,
    });
  }, [currentValue, setValues]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-[12px] border-[1px] border-white p-5"
    >
      <div className="text-2xl">{title}</div>
      <Input
        onChange={handleChange}
        value={values.percent}
        error={errors.percent}
        placeholder="number"
        type="number"
        id="percent"
        name="percent"
        disabled={isFetching}
      />
      <Button disabled={isFetching}>Change</Button>
    </form>
  );
};
