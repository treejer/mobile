import {colors} from 'constants/values';
import React from 'react';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import Spacer from 'components/Spacer';

export type TSubmitTransferProps = {
  disabled: boolean;
  hasHistory: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  onHistory: () => void;
};

export function SubmitTransfer(props: TSubmitTransferProps) {
  const {disabled = false, hasHistory = true, onCancel, onSubmit, onHistory} = props;

  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      {!disabled && (
        <>
          <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onCancel}>
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
        activeOpacity={+disabled}
      >
        <Text style={disabled ? styles.muteText : styles.whiteText}>{t('transfer.form.transfer')}</Text>
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
