import React, {useMemo} from 'react';
import {ScrollView as RNScrollView, View, ScrollViewProps as RNScrollViewProps} from 'react-native';
import {useDimensions} from 'utilities/hooks/useDimensions';

export type ScrollViewProps = React.PropsWithChildren<
  {
    autoHeight?: boolean | number;
    onlyWeb?: boolean;
  } & RNScrollViewProps
>;

export function ScrollView(props: ScrollViewProps) {
  const {children, onlyWeb, autoHeight, showsVerticalScrollIndicator, ...restProps} = props;

  const dimensions = useDimensions();

  const height = useMemo(() => {
    if (autoHeight === false || autoHeight === undefined) {
      return dimensions.window.height;
    } else {
      if (typeof autoHeight === 'number') {
        return autoHeight;
      } else {
        return undefined;
      }
    }
  }, [autoHeight, dimensions]);

  return (
    <RNScrollView {...restProps}>
      <View style={[{height}]}>{children}</View>
    </RNScrollView>
  );
}
