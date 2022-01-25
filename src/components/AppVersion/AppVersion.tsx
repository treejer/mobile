import React from 'react';
import {StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import {version} from '../../../package.json';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';

export interface AppVersionProps {
  style?: StyleProp<TextStyle>;
}

export default function AppVersion(props: AppVersionProps) {
  const {style} = props;

  return <Text style={[styles.version, style]}>v{version}</Text>;
}

const styles = StyleSheet.create({
  version: {
    ...globalStyles.tiny,
    textAlign: 'center',
    color: colors.gray,
  },
});
