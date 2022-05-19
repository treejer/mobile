import globalStyles from 'constants/styles';
import React from 'react';
import {RefreshControl, ScrollView} from 'react-native';

interface PullToRefreshProps {
  children: JSX.Element | JSX.Element[];
  refreshing: boolean;
  onRefresh: () => Promise<any>;
}

export default function PullToRefresh(props: PullToRefreshProps) {
  const {children} = props;

  return <>{children}</>;
}
