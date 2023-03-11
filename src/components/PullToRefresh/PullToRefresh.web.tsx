import React from 'react';
import {PullToRefresh as PullToRefreshContainer, PullDownContent, RefreshContent} from 'react-js-pull-to-refresh';

import {colors} from 'constants/values';

interface PullToRefreshProps {
  children: JSX.Element | JSX.Element[];
  onRefresh: () => Promise<any>;
  disabled?: boolean;
}

export default function PullToRefresh(props: PullToRefreshProps) {
  const {children, onRefresh, disabled = false} = props;

  if (disabled) {
    return <>{children}</>;
  }
  return (
    <PullToRefreshContainer
      pullDownContent={<PullDownContent />}
      releaseContent={<></>}
      refreshContent={<RefreshContent />}
      onRefresh={onRefresh}
      pullDownThreshold={200}
      triggerHeight="auto"
      containerStyle={{height: '100%', backgroundColor: colors.khaki}}
    >
      {children}
    </PullToRefreshContainer>
  );
}
