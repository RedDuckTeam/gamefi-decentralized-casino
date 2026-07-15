import { type FC, type PropsWithChildren } from 'react';

export const Loading: FC<
  PropsWithChildren & { isLoading: boolean; isError: boolean }
> = ({ children, isError, isLoading }) => {
  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error =(</span>;
  }

  return children;
};
