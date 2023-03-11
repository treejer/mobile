import React from 'react';
import {View} from 'react-native';

import {colors} from 'constants/values';

export type ContainerLoadingProps = {
  loading: boolean;
  children?: any;
  container?: boolean;
};

export function ContainerLoading(props: ContainerLoadingProps) {
  const {children, container = false} = props;

  return (
    <View
      style={{
        flex: Number(container),
        position: 'relative',
        backgroundColor: colors.transparent,
      }}
    >
      {children}
    </View>
  );
}
