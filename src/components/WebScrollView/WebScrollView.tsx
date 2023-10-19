import React from 'react';
import {ScrollView as RNScrollView, ScrollViewProps as RNScrollViewProps} from 'react-native';

export type ScrollViewProps = React.PropsWithChildren<
  {
    autoHeight?: boolean | number;
    onlyWeb?: boolean;
  } & RNScrollViewProps
>;

export function ScrollView(props: ScrollViewProps) {
  const {children, onlyWeb, showsVerticalScrollIndicator, ...restProps} = props;

  if (onlyWeb) {
    return <>{children}</>;
  }

  return (
    <RNScrollView {...restProps} showsVerticalScrollIndicator={showsVerticalScrollIndicator || false}>
      {children}
    </RNScrollView>
  );
}
