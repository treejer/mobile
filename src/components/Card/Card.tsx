import React from 'react';
import {View, StyleSheet, TouchableOpacityProps, ViewProps} from 'react-native';
import {colors} from 'constants/values';

interface Props extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewProps['style'];
}

const Card = React.forwardRef<View, Props>(({children, style, testID}, ref) => {
  return (
    <View ref={ref} style={[styles.container, style]} testID={testID}>
      {children}
    </View>
  );
});

Card.displayName = 'Card';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    ...colors.smShadow,
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
});

export default Card;
