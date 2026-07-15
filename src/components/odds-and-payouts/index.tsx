import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type GameOddAndPayout = {
  id: number;
  bet: string;
  number: number;
  payout: string;
  odd: string;
};

export default function OddsAndPayouts({
  config,
}: {
  config: GameOddAndPayout[];
}) {
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h3 className="text-center text-[24px] tracking-[0.96px] text-text">
        Odds & Payouts
      </h3>
      <div className="w-full md:w-2/3">
        <Table className="border-separate border-spacing-y-4">
          <TableHeader>
            <TableRow className="text-[12px] [&_th]:text-center">
              <TableHead className="pl-0 !text-left">Bet</TableHead>
              <TableHead className="!text-left">Numbers</TableHead>
              <TableHead>Payouts</TableHead>
              <TableHead>Odds</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_td]:border-b [&_td]:border-[#22252f]">
            {config.map(({ id, bet, number, payout, odd }) => (
              <TableRow key={id} className="[&_td]:text-center">
                <TableCell className="pl-0 !text-left">{bet}</TableCell>
                <TableCell className="!text-left">{number}</TableCell>
                <TableCell>{payout}</TableCell>
                <TableCell>{odd}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
