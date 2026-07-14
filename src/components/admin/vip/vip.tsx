import { SetRankFee } from '@/components/admin/vip/set-rank-fee.tsx';
import { SetUserRank } from '@/components/admin/vip/set-user-rank.tsx';

export const Vip = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-center text-4xl">VIP</div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SetRankFee />
        <SetUserRank />
      </div>
    </div>
  );
};
