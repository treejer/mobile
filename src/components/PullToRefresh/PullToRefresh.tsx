import React from 'react';

interface PullToRefreshProps {
  children: JSX.Element | JSX.Element[];
  onRefresh: () => Promise<any>;
}

export default function PullToRefresh(props: PullToRefreshProps) {
  const {children} = props;

  return <>{children}</>;
}
