import React from 'react';
import {
  PullToRefresh as PullToRefreshContainer,
  PullDownContent,
  ReleaseContent,
  RefreshContent,
} from 'react-js-pull-to-refresh';

interface PullToRefreshProps {
  children: JSX.Element | JSX.Element[];
  onRefresh: () => Promise<any>;
}

export default function PullToRefresh(props: PullToRefreshProps) {
  const {children, onRefresh} = props;

  return (
    <PullToRefreshContainer
      pullDownContent={<PullDownContent />}
      releaseContent={<></>}
      refreshContent={<RefreshContent />}
      onRefresh={onRefresh}
      pullDownThreshold={200}
      triggerHeight="auto"
      containerStyle={{height: '100%'}}
    >
      {children}
    </PullToRefreshContainer>
  );
}
