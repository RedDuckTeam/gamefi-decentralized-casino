import { type FormikHelpers, useFormik } from 'formik';
import { type Address } from 'viem';
import * as Yup from 'yup';

import { apiPostVipGreeting } from '@/api/vip-greeting.ts';
import { Input } from '@/components/admin/components/ui/input.tsx';
import { Button } from '@/components/ui/button';
import { useTokenCookie } from '@/hooks/admin/useTokenCookie';
import { useVip } from '@/hooks/admin/useVip.ts';
import { useToast } from '@/hooks/useToast';
import { addressRegex } from '@/lib/utils.ts';

interface ISetUserRank {
  address: string;
  rank: number;
}

const validationSchema = Yup.object().shape({
  address: Yup.string()
    .matches(addressRegex, 'Wrong address')
    .required('Required'),
});
export const SetUserRank = () => {
  const { setUserRank } = useVip();
  const { toast } = useToast();
  const { getOrCreateToken } = useTokenCookie();

  const { handleChange, values, handleSubmit, errors } = useFormik({
    initialValues: {
      address: '',
      rank: 0,
    },
    validationSchema,
    onSubmit: async (
      values: ISetUserRank,
      { setSubmitting }: FormikHelpers<ISetUserRank>,
    ) => {
      const token = await getOrCreateToken();
      setUserRank({ args: [values.address as Address, Number(values.rank)] })
        .then(() =>
          values.rank !== 0
            ? apiPostVipGreeting(values.address as Address, values.rank, token)
            : null,
        )
        .catch((e) => {
          toast({
            description: JSON.stringify(e?.cause?.shortMessage),
            variant: 'destructive',
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  return (
    <div className="flex flex-col gap-5 rounded-[12px] border-[1px] border-white p-5">
      <div className="text-2xl">Set User Rank</div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          error={errors.address}
          id="address"
          name="address"
          placeholder="account address"
          onChange={handleChange}
          value={values.address}
        />
        <select
          className="rounded-sm px-2 py-1"
          name="rank"
          id="rank"
          onChange={handleChange}
          value={values.rank}
        >
          <option value="0">DEFAULT</option>
          <option value="1">BRONZE</option>
          <option value="2">SILVER</option>
          <option value="3">GOLD</option>
        </select>
        <Button>Set</Button>
      </form>
    </div>
  );
};
