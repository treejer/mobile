import {colors} from 'constants/values';

import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {TouchableProps} from 'react-native-svg';

interface Props<P> extends TouchableProps {
  icon: React.FunctionComponent<P>;
  variant?: 'success' | 'primary';
  size?: number;
  props?: P;
}

function IconButton<P>({icon: Icon, size = 64, variant = 'primary', props, ...rest}: Props<P>) {
  return (
    <TouchableOpacity
      {...rest}
      style={[
        {
          height: size,
          width: size,
          borderRadius: size / 2,
        },
        styles.container,
        styles[`${variant}Container`],
      ]}
    >
      <Icon {...props} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryContainer: {
    backgroundColor: colors.khakiDark,
  },
  successContainer: {
    backgroundColor: colors.green,
  },
});

export default IconButton;
