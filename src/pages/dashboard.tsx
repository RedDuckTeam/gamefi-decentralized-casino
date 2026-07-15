import { type FC, Fragment, type JSX } from 'react';
import useSWR from 'swr';
import { useAccount } from 'wagmi';

import { graphFetcher } from '@/api/graph.ts';
import SvgLoader from '@/components/ui/svg/spinning-circles.svg';
import {
  getDashboard,
  type IDashboard,
} from '@/lib/graph/queries/getDashboard.ts';

export const DashboardPage = () => {
  const { address } = useAccount();

  const {
    data: untypedDashboard,
    isLoading: isDashboardLoading,
    error,
  } = useSWR(
    {
      query: getDashboard(),
      fetchPolicy: 'network-only',
      variables: {
        user: address,
      },
    },
    graphFetcher,
  );

  const dashboard = untypedDashboard as { data: IDashboard } | undefined;

  if (error) {
    return (
      <div className="grid grid-cols-1 p-4">
        <div className="mx-auto">Error</div>
      </div>
    );
  }

  const gameProfitsElements = dashboard?.data.gameProfits.map((profit) => {
    return (
      <div
        key={profit.id}
        className="flex flex-row items-center justify-between"
      >
        <div className="flex flex-row items-center gap-2">
          <div className="h-[10px] w-[10px] rounded-full bg-[#FFC300]" />
          <div>{profit.tokenSymbol}</div>
        </div>
        <div>{profit.sumOfWins / 10 ** profit.tokenDecimals}</div>
      </div>
    );
  });

  const gameSummariesElements = dashboard?.data.gameSummaries.map((game) => {
    return (
      <Fragment key={game.id}>
        <div className="flex flex-row items-center gap-2">
          <div className="h-[10px] w-[10px] rounded-full bg-[#FFC300]" />
          <div>{game.name}</div>
        </div>
        <div className="flex flex-row">
          <div>{game.counter}</div>
        </div>
      </Fragment>
    );
  });

  const gameHistoriesElements = dashboard?.data.gameHistories.map((game) => {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(game.date * 1000));

    const bet = game.bet / 10 ** game.decimals;
    const win = game.win / 10 ** game.decimals;

    return (
      <div
        key={game.id}
        className="grid grid-cols-5 border-b-[1px] border-[#1C1A24] pb-2 pt-4"
      >
        <div>{game.name}</div>
        <div>{game.asset}</div>
        <div>{bet}</div>
        <div>{win > 0 ? win : '-'}</div>
        <div>{formattedDate}</div>
      </div>
    );
  });

  const Loading: FC<{
    isLoading: boolean;
    children: JSX.Element[] | undefined;
  }> = ({ children, isLoading }) => {
    if (isLoading) {
      return (
        <div className="flex justify-center pb-2">
          <img className="h-8 w-auto" src={SvgLoader} alt="loader" />
        </div>
      );
    }

    if (!children?.length) {
      return <Fragment>Empty</Fragment>;
    }

    return <Fragment>{children}</Fragment>;
  };

  return (
    <div className="grid grid-cols-1 gap-8 px-4 py-8 lg:px-20 lg:py-8">
      <div className="text-[32px] font-semibold">Dashboard</div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6 rounded-[32px] bg-[#020107A3] p-6">
          <div className="text-[18px] font-semibold">Profit</div>
          <div>
            <div className="text-[#939393]">Tokens</div>
            <Loading
              isLoading={isDashboardLoading}
              children={gameProfitsElements}
            />
          </div>
          {/*<hr />*/}
          {/*<div className="grid grid-cols-1">*/}
          {/*  <div>*/}
          {/*    <div className="text-[#939393]">Dollars (summary)</div>*/}
          {/*    <div>-</div>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
        <div className="flex flex-col gap-6 rounded-[32px] bg-[#020107A3] p-6">
          <div className="text-[18px] font-semibold">Game summary</div>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="text-[#939393]">Game</div>
            <div className="text-[#939393]">Spin</div>
            <Loading
              isLoading={isDashboardLoading}
              children={gameSummariesElements}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 rounded-[32px] bg-[#020107A3] p-6">
        <div>History</div>
        <div className="overflow-x-scroll lg:overflow-visible">
          <div className="min-w-[1000px] lg:min-w-fit">
            <div className="grid grid-cols-5">
              <div>Game</div>
              <div>Asset</div>
              <div>Bet</div>
              <div>Win</div>
              <div>Date</div>
            </div>
            <Loading
              isLoading={isDashboardLoading}
              children={gameHistoriesElements}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
