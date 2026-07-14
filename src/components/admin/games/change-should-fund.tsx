import { useFormik } from 'formik';
import { useWriteContract } from 'wagmi';

import { gameAbi } from '@/abi/gameAbi.ts';
import { Input } from '@/components/admin/components/ui/input.tsx';
import { Button } from '@/components/ui/button';
import { useAdminStore } from '@/hooks/admin/useAdminStore.ts';

export const ChangeShouldFund = () => {
  const gameAddress = useAdminStore((state) => state.activeAddress);

  const { writeContractAsync } = useWriteContract();

  const { handleSubmit, values, handleChange, errors } = useFormik({
    initialValues: {
      shouldFund: false,
    },
    onSubmit: (values) => {
      writeContractAsync({
        abi: gameAbi,
        functionName: 'changeShouldFund',
        address: gameAddress,
        args: [values.shouldFund],
      });
    },
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-[12px] border-[1px] border-white p-5"
    >
      <div className="text-2xl">
        Should cover chainlink expenses when the game starts.
      </div>
      <div className="flex flex-row items-center gap-2">
        <Input
          onChange={handleChange}
          checked={values.shouldFund}
          error={errors.shouldFund}
          type="checkbox"
          id="shouldFund"
          name="shouldFund"
        />
        <label htmlFor="shouldFund">Should Fund</label>
      </div>
      <Button>Change</Button>
    </form>
  );
};
