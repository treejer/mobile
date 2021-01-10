import React from 'react';
import {View, StyleSheet, TouchableOpacityProps, ViewProps} from 'react-native';

interface Props extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewProps['style'];
}

const Card = React.forwardRef<View, Props>(({children, style}, ref) => {
  return (
    <View ref={ref} style={[styles.container, style]}>
      {children}
    </View>
  );
});

Card.displayName = 'Card';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    elevation: 6,
    shadowOffset: {
      width: 2,
      height: 6,
    },
    shadowRadius: 40,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
});

export default Card;
