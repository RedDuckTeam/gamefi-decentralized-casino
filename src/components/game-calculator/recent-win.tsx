import { useActiveToken } from '@/hooks/useActiveToken';
import { formatWithComma } from '@/lib/utils';

export default function RecentWin({ recentWin }: { recentWin: number }) {
  const { activeToken } = useActiveToken();
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs font-bold text-text">Recent win:</p>
      <p className="text-sm text-white" data-cy="recentWinAmount">
        {formatWithComma(recentWin) || '00.00'} {activeToken?.symbol}
      </p>
    </div>
  );
}
