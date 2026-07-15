import { type FormikHelpers, useFormik } from 'formik';
import * as Yup from 'yup';

import { Input } from '@/components/admin/components/ui/input.tsx';
import { Button } from '@/components/ui/button';
import { useAdminManagement } from '@/hooks/admin/useAdminManagement.ts';
import { addressRegex } from '@/lib/utils.ts';

interface IDeleteAdmin {
  address: string;
}

const validationSchema = Yup.object().shape({
  address: Yup.string()
    .matches(addressRegex, 'Wrong address')
    .required('Required'),
});

export const DeleteAdmin = () => {
  const { deleteAdmin } = useAdminManagement();

  const { handleSubmit, values, handleChange, errors } = useFormik({
    initialValues: {
      address: '',
    },
    validationSchema,
    onSubmit: (
      values: IDeleteAdmin,
      { setSubmitting }: FormikHelpers<IDeleteAdmin>,
    ) => {
      deleteAdmin(values.address).finally(() => {
        setSubmitting(false);
      });
    },
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-[12px] border-[1px] border-white p-5"
    >
      <div className="text-2xl">Delete Admin</div>
      <Input
        error={errors.address}
        value={values.address}
        onChange={handleChange}
        placeholder="account address"
        id="address"
        name="address"
      />
      <Button>Delete</Button>
    </form>
  );
};
