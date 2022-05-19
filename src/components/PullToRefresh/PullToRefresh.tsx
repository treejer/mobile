import globalStyles from 'constants/styles';
import React from 'react';
import {RefreshControl, ScrollView} from 'react-native';

interface PullToRefreshProps {
  children: React.ReactChild;
  profileLoading?: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<any>;
}

export default function PullToRefresh(props: PullToRefreshProps) {
  const {children, profileLoading, refreshing, onRefresh} = props;
  return (
    <ScrollView
      style={[globalStyles.screenView, globalStyles.fill]}
      refreshControl={<RefreshControl refreshing={profileLoading || refreshing} onRefresh={onRefresh} />}
    >
      {children}
    </ScrollView>
  );
}
