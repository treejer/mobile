import React from 'react';

interface PullToRefreshProps {
  children: JSX.Element | JSX.Element[];
  onRefresh?: () => Promise<any>;
  disabled?: boolean;
}

export default function PullToRefresh(props: PullToRefreshProps) {
  const {children} = props;

  return <>{children}</>;
}
