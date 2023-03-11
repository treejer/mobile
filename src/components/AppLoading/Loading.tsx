import React from 'react';
import {ActivityIndicator, ActivityIndicatorProps} from 'react-native';

import {ContainerLoading} from './ContainerLoading';

export type LoadingProps = {
  loading: boolean;
  children?: any;
  loadingSize?: ActivityIndicatorProps['size'];
  loadingColor?: ActivityIndicatorProps['color'];
  container?: boolean;
};

export function Loading(props: LoadingProps) {
  const {loading, children, loadingSize, loadingColor, container} = props;

  return (
    <ContainerLoading loading={loading} container={container}>
      {children}
      {loading ? (
        <ActivityIndicator
          style={{position: 'absolute', right: 0, left: 0, bottom: 0, top: 0}}
          color={loadingColor}
          size={container ? loadingSize || 'large' : undefined}
        />
      ) : null}
    </ContainerLoading>
  );
}
