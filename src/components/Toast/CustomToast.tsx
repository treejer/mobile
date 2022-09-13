import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {ToastProps} from 'react-native-toast-notifications/lib/typescript/toast';

import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import {AlertMode} from 'utilities/helpers/alert';

export type ToastContainerProps = {
  toastOptions: ToastProps;
  mode: AlertMode;
};
export function CustomToast(props: ToastContainerProps) {
  const {toastOptions, mode} = props;

  return (
    <View style={[styles.container, {backgroundColor: colors[mode]}]}>
      <Spacer />
      {toastOptions.icon}
      <Spacer times={2} />
      <Text style={styles.text}>{toastOptions.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 343,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    borderRadius: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.white,
  },
  text: {
    fontSize: 14,
    color: '#FFF',
  },
});
