import { type FormikHelpers, useFormik } from 'formik';
import { getAddress } from 'viem';
import * as Yup from 'yup';

import { Input } from '@/components/admin/components/ui/input.tsx';
import { Button } from '@/components/ui/button';
import { useGames } from '@/hooks/admin/useGames.ts';
import { addressRegex } from '@/lib/utils.ts';

interface ISetIsTokenAllowed {
  address: string;
  value: boolean;
}

const validationSchema = Yup.object().shape({
  address: Yup.string()
    .matches(addressRegex, 'Wrong address')
    .required('Required'),
});

export const SetIsTokenAllowed = () => {
  const { setIsTokenAllowed } = useGames();

  const { values, handleChange, handleSubmit, errors } = useFormik({
    initialValues: {
      address: '',
      value: false,
    },
    validationSchema,
    onSubmit: (
      values: ISetIsTokenAllowed,
      { setSubmitting }: FormikHelpers<ISetIsTokenAllowed>,
    ) => {
      setIsTokenAllowed({
        args: [getAddress(values.address), values.value],
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
      <div className="text-2xl">Set Is Token Allowed</div>
      <Input
        error={errors.address}
        placeholder="address"
        value={values.address}
        name="address"
        id="address"
        onChange={handleChange}
      />
      <div className="flex flex-row items-center gap-2">
        <Input
          error={errors.value}
          type="checkbox"
          name="value"
          id="value"
          checked={values.value}
          onChange={handleChange}
        />
        <label htmlFor="value">Is Token Allowed</label>
      </div>
      <Button>Change</Button>
    </form>
  );
};
