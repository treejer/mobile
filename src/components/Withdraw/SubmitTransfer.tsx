import React, {useEffect} from 'react';
import {TouchableOpacity, View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';

import {colors} from 'constants/values';
import Spacer from 'components/Spacer';

export type TSubmitTransferProps = {
  disabled: boolean;
  hasHistory: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  onHistory: () => void;
  loading: boolean;
};

export function SubmitTransfer(props: TSubmitTransferProps) {
  const {disabled, hasHistory, loading, onCancel, onSubmit, onHistory} = props;

  const {t} = useTranslation();

  useEffect(() => {
    console.log(disabled, 'is hereee');
  }, [disabled]);

  return (
    <View style={styles.container}>
      {!disabled && (
        <>
          <TouchableOpacity
            activeOpacity={+loading}
            disabled={loading}
            style={[styles.btn, loading ? styles.cancelDisabledBtn : styles.cancelBtn]}
            onPress={onCancel}
          >
            <Icon style={styles.whiteText} name="md-close-circle-sharp" size={32} />
          </TouchableOpacity>
          <Spacer times={4} />
        </>
      )}
      {hasHistory && disabled && (
        <>
          <TouchableOpacity style={[styles.btn, styles.historyBtn]} onPress={onHistory}>
            <Text style={styles.whiteText}>{t('transfer.form.history')}</Text>
          </TouchableOpacity>
          <Spacer times={4} />
        </>
      )}
      <TouchableOpacity
        style={[styles.btn, disabled ? styles.disabledBtn : styles.submitBtn]}
        onPress={onSubmit}
        activeOpacity={+disabled || +loading}
        disabled={disabled || loading}
      >
        <Text style={disabled ? styles.muteText : styles.whiteText}>{t('transfer.form.transfer')}</Text>
        {loading ? <ActivityIndicator style={{marginLeft: 8}} /> : null}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 360,
    flexDirection: 'row',
  },
  btn: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 6,
    shadowOffset: {
      width: 2,
      height: 6,
    },
    shadowRadius: 40,
    shadowColor: 'black',
    shadowOpacity: 0.1,
  },
  cancelBtn: {
    width: 64,
    backgroundColor: colors.red,
  },
  cancelDisabledBtn: {
    width: 64,
    backgroundColor: colors.khakiDark,
    color: colors.gray,
  },
  whiteText: {
    color: '#FFF',
  },
  muteText: {
    color: colors.gray,
  },
  submitBtn: {
    height: 48,
    flex: 1,
    backgroundColor: colors.green,
  },
  disabledBtn: {
    flex: 1,
    backgroundColor: colors.khakiDark,
    color: colors.gray,
  },
  historyBtn: {
    flex: 1,
    backgroundColor: colors.grayDarker,
  },
});
