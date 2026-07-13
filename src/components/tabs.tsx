import { type FC, Fragment, type JSX, useState } from 'react';

import { cn } from '@/lib/utils.ts';

interface Tab {
  name: string;
  component: JSX.Element;
}

interface OwnProps {
  tabs: Array<Tab>;
}

export const Tabs: FC<OwnProps> = (props) => {
  const { tabs } = props;
  const [currentTab, setTab] = useState<number>(0);

  return (
    <Fragment>
      <div className="grid grid-cols-1 overflow-y-auto rounded-t-[12px] border-b bg-[#9747FF99]">
        <div className="flex w-full flex-row gap-4">
          {tabs.map((e, index) => {
            return (
              <button
                key={index}
                className={cn(
                  ' px-4 py-2',
                  currentTab === index && 'rounded-t-[12px] bg-[#9747FF]',
                )}
                onClick={() => setTab(index)}
              >
                {e.name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="m-4">{tabs[currentTab].component}</div>
    </Fragment>
  );
};
