import React from 'react';
import {ActivityIndicator, View, ViewProps} from 'react-native';
import {colors} from 'constants/values';

export type ContainerLoadingProps = {
  loading: boolean;
  containerStyle?: ViewProps['style'];
  children?: any;
  container?: boolean;
};

export function ContainerLoading(props: ContainerLoadingProps) {
  const {loading, containerStyle, children, container = false} = props;

  return (
    <View
      style={[
        {
          zIndex: 9999,
          flex: Number(container),
          position: 'relative',
          backgroundColor: loading ? colors.grayOpacity : undefined,
        },
        containerStyle,
      ]}
    >
      {children}
      {loading ? (
        <ActivityIndicator
          color={colors.white}
          size="large"
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            left: 0,
            top: 0,
          }}
        />
      ) : null}
    </View>
  );
}
