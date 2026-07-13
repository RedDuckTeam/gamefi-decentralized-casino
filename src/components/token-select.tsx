import React, { type FC } from 'react';
import { zeroAddress } from 'viem';

import { Loading } from '@/components/loading.tsx';

export interface SelectableToken {
  address: string;
  symbol?: string;
}

interface IOwnProps {
  value: string;
  tokens: SelectableToken[] | undefined;
  isLoading: boolean;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

export const TokenSelect: FC<IOwnProps> = (props) => {
  const { value, onChange, tokens, isLoading } = props;

  return (
    <Loading isLoading={isLoading} isError={false}>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-sm px-2 py-1"
      >
        <option value={zeroAddress}>--Select Token--</option>
        {tokens?.map((token) => {
          return (
            <option key={token.address} value={token.address}>
              {token.symbol}
            </option>
          );
        })}
      </select>
    </Loading>
  );
};
