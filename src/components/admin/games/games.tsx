import { useMemo } from 'react';
import { getAddress, isAddress } from 'viem';
import { useChainId } from 'wagmi';

import { SetIsTokenAllowed } from './set-is-token-allowed';

import { ChangeBetFeePercents } from '@/components/admin/games/change-bet-fee-percents.tsx';
import { ChangeBlocksToRefund } from '@/components/admin/games/change-blocks-to-refund.tsx';
import { ChangeHouseEdge } from '@/components/admin/games/change-house-edge.tsx';
import { ChangeMaxBetCounts } from '@/components/admin/games/change-max-bet-counts.tsx';
import { ChangeMaxBetSize } from '@/components/admin/games/change-max-bet-size.tsx';
import { ChangeMinBetSize } from '@/components/admin/games/change-min-bet-size.tsx';
import { ChangeShouldFund } from '@/components/admin/games/change-should-fund.tsx';
import { SetGameStarted } from '@/components/admin/games/set-game-started.tsx';
import { WithdrawTokens } from '@/components/admin/games/withdraw-tokens.tsx';
import { getGames } from '@/constants/contracts.ts';
import { useAdminStore } from '@/hooks/admin/useAdminStore.ts';

export const Games = () => {
  const setActiveAddress = useAdminStore((state) => state.setActiveAddress);
  const activeAddress = useAdminStore((state) => state.activeAddress);
  const chainId = useChainId();
  const games = getGames(chainId);

  const gameName = useMemo(() => {
    const foundId = games.find((game) => game.address === activeAddress)?.id;
    if (!foundId)
      throw new Error(`Can't find game with address: ${activeAddress}`);
    return foundId;
  }, [activeAddress, games]);

  return (
    <div>
      <div className="text-center text-4xl">Game Management</div>
      <div className="flex flex-col items-center gap-5">
        <div className="text-2xl">Select Game</div>
        <select
          value={activeAddress}
          onChange={(e) => setActiveAddress(getAddress(e.target.value))}
          className="rounded-sm px-2 py-1"
        >
          <option key={'0x'} value={'0x'}>
            ---Select Game---
          </option>
          {games.map((game) => {
            return (
              <option key={game.address} value={game.address}>
                {game.name}
              </option>
            );
          })}
        </select>
        {isAddress(activeAddress) && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <ChangeBlocksToRefund />
            <ChangeMaxBetCounts />
            <ChangeMaxBetSize />
            <ChangeMinBetSize name={gameName} />
            <SetGameStarted />
            <WithdrawTokens name={gameName} />
            <SetIsTokenAllowed />
            <ChangeBetFeePercents />
            <ChangeHouseEdge />
            <ChangeShouldFund />
          </div>
        )}
      </div>
    </div>
  );
};
