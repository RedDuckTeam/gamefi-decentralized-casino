import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '@/layouts/main-layout.tsx';

const AdminPage = lazy(() =>
  import('@/pages/admin.tsx').then((module) => ({
    default: module.AdminPage,
  })),
);
const BlastOffPage = lazy(() =>
  import('@/pages/blast-off.tsx').then((module) => ({
    default: module.BlastOffPage,
  })),
);
const CoinflipPage = lazy(() =>
  import('@/pages/coinflip.tsx').then((module) => ({
    default: module.CoinflipPage,
  })),
);
const DashboardPage = lazy(() =>
  import('@/pages/dashboard.tsx').then((module) => ({
    default: module.DashboardPage,
  })),
);
const DicePage = lazy(() =>
  import('@/pages/dice.tsx').then((module) => ({
    default: module.DicePage,
  })),
);
const LimboPage = lazy(() =>
  import('@/pages/limbo.tsx').then((module) => ({
    default: module.LimboPage,
  })),
);
const MainPage = lazy(() =>
  import('@/pages/main.tsx').then((module) => ({
    default: module.MainPage,
  })),
);
const NotFound = lazy(() =>
  import('@/pages/not-found.tsx').then((module) => ({
    default: module.NotFound,
  })),
);
const PlinkoPage = lazy(() =>
  import('@/pages/plinko.tsx').then((module) => ({
    default: module.PlinkoPage,
  })),
);
const ReferralsPage = lazy(() =>
  import('@/pages/referrals.tsx').then((module) => ({
    default: module.ReferralsPage,
  })),
);
const RockPaperScissorsPage = lazy(() =>
  import('@/pages/rock-paper-scissors.tsx').then((module) => ({
    default: module.RockPaperScissorsPage,
  })),
);
const RoulettePage = lazy(() =>
  import('../pages/roulette.tsx').then((module) => ({
    default: module.RoulettePage,
  })),
);
const SlidePage = lazy(() =>
  import('@/pages/slide.tsx').then((module) => ({
    default: module.SlidePage,
  })),
);
const SlotsPage = lazy(() =>
  import('@/pages/slots.tsx').then((module) => ({
    default: module.SlotsPage,
  })),
);
const WheelPage = lazy(() =>
  import('@/pages/wheel.tsx').then((module) => ({
    default: module.WheelPage,
  })),
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        Component: MainPage,
      },
      {
        path: '/roulette',
        Component: RoulettePage,
      },
      {
        path: '/dice',
        Component: DicePage,
      },
      {
        path: '/wheel',
        Component: WheelPage,
      },
      {
        path: '/limbo',
        Component: LimboPage,
      },
      {
        path: '/slide',
        Component: SlidePage,
      },
      {
        path: '/rock-paper-scissors',
        Component: RockPaperScissorsPage,
      },
      {
        path: '/plinko',
        Component: PlinkoPage,
      },
      {
        path: '/blast-off',
        Component: BlastOffPage,
      },
      {
        path: '/slots',
        element: <SlotsPage />,
      },
      {
        path: '/coinflip',
        Component: CoinflipPage,
      },
      {
        path: '/referrals',
        Component: ReferralsPage,
      },
      {
        path: '/admin',
        Component: AdminPage,
      },
      {
        path: '/dashboard',
        Component: DashboardPage,
      },
    ],
  },

  {
    path: '*',
    element: <MainLayout />,
    children: [{ path: '*', Component: NotFound }],
  },
]);
