import { type FormikHelpers, useFormik } from 'formik';
import { type Address } from 'viem';
import * as Yup from 'yup';

import { Input } from '@/components/admin/components/ui/input.tsx';
import { Button } from '@/components/ui/button';
import { useGames } from '@/hooks/admin/useGames.ts';
import { addressRegex } from '@/lib/utils.ts';

interface ISetGameStarted {
  address: string;
  checked: boolean;
}

const validationSchema = Yup.object().shape({
  address: Yup.string()
    .matches(addressRegex, 'Wrong address')
    .required('Required'),
});

export const SetGameStarted = () => {
  const { setGameStarted } = useGames();

  const { values, handleChange, handleSubmit, errors } = useFormik({
    initialValues: {
      address: '',
      checked: false,
    },
    validationSchema,
    onSubmit: (
      values: ISetGameStarted,
      { setSubmitting }: FormikHelpers<ISetGameStarted>,
    ) => {
      setGameStarted({
        args: [values.address as Address, values.checked],
      }).finally(() => {
        setSubmitting(false);
      });
    },
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-[12px] border-[1px] border-white p-5"
    >
      <div className="text-2xl">Set Game Started</div>
      <Input
        error={errors.address}
        placeholder="address"
        value={values.address}
        onChange={handleChange}
        name="address"
        id="address"
      />
      <div className="flex flex-row items-center gap-2">
        <Input
          error={errors.checked}
          type="checkbox"
          checked={values.checked}
          onChange={handleChange}
          name="checked"
          id="checked"
        />
        <label htmlFor="checked">Is Started</label>
      </div>
      <Button>Set</Button>
    </form>
  );
};
