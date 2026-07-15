import { SetReferrerTier } from '@/components/admin/referrals/set-referrer-tier.tsx';

export const Referrals = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-center text-4xl">Referrals</div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-1">
        <SetReferrerTier />
      </div>
    </div>
  );
};
