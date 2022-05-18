import React from 'react';
import {
  PullToRefresh as PullToRefreshContainer,
  PullDownContent,
  ReleaseContent,
  RefreshContent,
} from 'react-js-pull-to-refresh';

interface PullToRefreshProps {
  children: React.ReactChild;
  profileLoading?: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<any>;
}

export default function PullToRefresh(props: PullToRefreshProps) {
  const {children, onRefresh} = props;
  return (
    <PullToRefreshContainer
      pullDownContent={<PullDownContent />}
      releaseContent={<ReleaseContent />}
      refreshContent={<RefreshContent />}
      onRefresh={onRefresh}
      pullDownThreshold={200}
      triggerHeight="auto"
      containerStyle={{overflowY: 'auto'}}
    >
      {children}
    </PullToRefreshContainer>
  );
}
