import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ToastProps} from 'react-native-toast-notifications/lib/typescript/toast';
import {useTranslation} from 'react-i18next';

import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import {AlertMode} from 'utilities/helpers/alert';

export type ToastContainerProps = {
  toastOptions: ToastProps;
  mode: AlertMode;
};

export function CustomToast(props: ToastContainerProps) {
  const {toastOptions, mode} = props;

  const {t} = useTranslation();

  return (
    <View style={[styles.container, {backgroundColor: colors[mode]}]}>
      {toastOptions?.title && (
        <>
          <View style={styles.row}>
            {toastOptions.icon ? (
              <>
                {toastOptions.icon}
                <Spacer times={2} />
              </>
            ) : null}
            <Text style={[styles.text, styles.title]}>
              {toastOptions.translate ? t(toastOptions.title, toastOptions.tParams?.title) : toastOptions.title}
            </Text>
          </View>
          <Spacer />
        </>
      )}
      {toastOptions.message && (
        <View style={styles.row}>
          {!toastOptions.title && toastOptions.icon ? (
            <>
              {toastOptions.icon}
              <Spacer times={2} />
            </>
          ) : null}
          <Text style={styles.text}>
            {toastOptions.translate ? t(toastOptions.message, toastOptions.tParams?.message) : toastOptions.message}
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.closeBtn}
        hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
        onPress={toastOptions.onHide}
      >
        <Icon name="close" size={23} style={styles.closeIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 343,
    minHeight: 64,
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginVertical: 8,
    borderRadius: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
  },
  text: {
    fontSize: 14,
    color: '#FFF',
    flex: 1,
  },
  closeBtn: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  closeIcon: {
    fontSize: 16,
    color: '#FFF',
  },
});
