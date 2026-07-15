import { formatUnits } from 'viem';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type BetToken } from '@/types/tokens';

export default function TokenSelect({
  tokens,
  activeToken,
  onTokenChange,
}: {
  tokens: BetToken[] | undefined;
  activeToken: BetToken | null;
  onTokenChange: (token: string) => void;
}) {
  return (
    <Select value={activeToken?.symbol} onValueChange={onTokenChange}>
      <SelectTrigger className="flex w-fit border-none px-0 outline-none [&_span]:pr-1">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="w-64 rounded-[18px] border-none bg-[#161928] p-0">
        {tokens?.map(({ symbol, icon, balance, decimals }) => (
          <SelectItem
            key={symbol}
            value={symbol}
            displayValue={formatUnits(balance || 0n, decimals || 18)}
          >
            <div className="flex grow items-center gap-1">
              <img className="h-4 w-4" src={icon} alt={symbol} />
              <div className="flex grow text-sm font-medium text-text">
                {symbol}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
