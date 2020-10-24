import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {Times} from 'components/Icons';
import {colors} from 'constants/values';

interface Props {
  icon?: string;
  variant?: 'success' | 'primary';
}

function IconButton({icon, variant = 'primary'}: Props) {
  return (
    <TouchableOpacity style={[styles.container, styles[`${variant}Container`]]}>
      <Times />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    width: 64,
    borderRadius: 32,
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
