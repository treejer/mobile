import React, {useEffect, useMemo, useState} from 'react';
import {Dimensions, ScrollView as RNScrollView, View, ScrollViewProps as RNScrollViewProps} from 'react-native';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

export type ScrollViewProps = React.PropsWithChildren<
  {
    autoHeight?: boolean | number;
    onlyWeb?: boolean;
  } & RNScrollViewProps
>;

export function ScrollView(props: ScrollViewProps) {
  const {children, onlyWeb, autoHeight, showsVerticalScrollIndicator, ...restProps} = props;

  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window, screen}) => {
      setDimensions({window, screen});
    });
    return () => subscription?.remove();
  });

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
