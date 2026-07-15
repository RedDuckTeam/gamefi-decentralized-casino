import { type ReactNode } from 'react';

import NavbarItem from './sidebar-item';

import { BaseTooltip } from '@/components/ui/base-tooltip.tsx';
import DashboardSvg from '@/components/ui/svg/dashboard.svg';
import DocsSvg from '@/components/ui/svg/docs.svg';
import HomeSvg from '@/components/ui/svg/home.svg';
import ReferralsSvg from '@/components/ui/svg/referrals.svg';
import { type NavigationItem, navigationItems } from '@/constants/navigation';

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <p className="my-4 text-[12px] font-semibold uppercase text-[#737373]">
    {children}
  </p>
);

const NavigationList = ({ items }: { items: NavigationItem[] }) => (
  <div className="flex flex-col gap-4">
    {items.map((item) => (
      <NavbarItem {...item} key={item.id} />
    ))}
  </div>
);

export default function Sidebar() {
  return (
    <div className="flex h-full min-w-[242px] flex-col gap-1 px-4 py-3 xl:bg-[#070513]">
      <NavbarItem iconSize="small" icon={HomeSvg} label="Home" url="/" />
      <NavbarItem
        iconSize="small"
        icon={ReferralsSvg}
        label="Referrals"
        url="/referrals"
      />
      <NavbarItem
        iconSize="small"
        icon={DashboardSvg}
        label="Dashboard"
        url="/dashboard"
      />
      <SectionHeading>Games</SectionHeading>
      <NavigationList items={navigationItems} />
      <SectionHeading>Other</SectionHeading>

      <BaseTooltip content={<p>COMING SOON</p>}>
        <NavbarItem
          disabled
          iconSize="small"
          icon={DocsSvg}
          label="Documentation"
          url="/docs"
        />
      </BaseTooltip>
    </div>
  );
}
