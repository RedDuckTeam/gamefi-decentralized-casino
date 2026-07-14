import { lazy } from 'react';

import { FirstBlock } from '@/components/pages/landing/first-block.tsx';
import { OurPartners } from '@/components/pages/landing/our-partners.tsx';

const Earning = lazy(() =>
  import('@/components/pages/landing/earning.tsx').then((module) => ({
    default: module.Earning,
  })),
);

const Disclaimer = lazy(() =>
  import('@/components/pages/landing/disclaimer.tsx').then((module) => ({
    default: module.Disclaimer,
  })),
);

export const MainPage = () => {
  return (
    <div className="grid grid-cols-1">
      <FirstBlock />
      <OurPartners />
      <Earning />
      <Disclaimer />
    </div>
  );
};
