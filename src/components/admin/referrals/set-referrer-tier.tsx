import { type FormikHelpers, useFormik } from 'formik';
import { type Address } from 'viem';
import { useChainId, useWriteContract } from 'wagmi';
import * as Yup from 'yup';

import { referralStorageAbi } from '@/abi/referralStorageAbi.ts';
import { apiPostReferralsGreeting } from '@/api/referrals-greeting';
import { Input } from '@/components/admin/components/ui/input.tsx';
import { Button } from '@/components/ui/button';
import { getContractAddresses } from '@/constants/contracts.ts';
import { useTokenCookie } from '@/hooks/admin/useTokenCookie';
import { useToast } from '@/hooks/useToast';
import { addressRegex } from '@/lib/utils.ts';

interface ISetUserTier {
  address: string;
  tier: number;
}

const validationSchema = Yup.object().shape({
  address: Yup.string()
    .matches(addressRegex, 'Wrong address')
    .required('Required'),
  tier: Yup.number().min(0).max(2).required('Required'),
});

export const SetReferrerTier = () => {
  const chainId = useChainId();
  const { toast } = useToast();
  const { getOrCreateToken } = useTokenCookie();

  const { writeContractAsync } = useWriteContract();

  const setReferrerTier = ({ args }: { args: readonly [Address, bigint] }) =>
    writeContractAsync({
      abi: referralStorageAbi,
      functionName: 'setReferrerTier',
      address: getContractAddresses(chainId).referralStorage,
      args,
    });

  const { handleSubmit, values, handleChange, errors } = useFormik({
    initialValues: {
      address: '',
      tier: 0,
    },
    validationSchema,
    onSubmit: async (
      values: ISetUserTier,
      { setSubmitting }: FormikHelpers<ISetUserTier>,
    ) => {
      const token = await getOrCreateToken();
      setReferrerTier({
        args: [values.address as Address, BigInt(values.tier)],
      })
        .then(() =>
          apiPostReferralsGreeting(
            values.address as Address,
            values.tier,
            token,
          ),
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-[12px] border-[1px] border-white p-5"
    >
      <div className="text-2xl">Set Referrer Tier</div>
      <Input
        onChange={handleChange}
        value={values.address}
        error={errors.address}
        placeholder="address"
        id="address"
        name="address"
      />
      <Input
        onChange={handleChange}
        value={values.tier}
        error={errors.tier}
        placeholder="number"
        type="number"
        id="tier"
        name="tier"
      />
      <Button type="submit">Set</Button>
    </form>
  );
};
