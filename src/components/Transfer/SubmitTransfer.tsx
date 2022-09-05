import {colors} from 'constants/values';
import React from 'react';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import Spacer from 'components/Spacer';

export type TSubmitTransferProps = {
  disabled?: boolean;
};

export function SubmitTransfer(props: TSubmitTransferProps) {
  const {disabled} = props;

  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      {!disabled && (
        <>
          <TouchableOpacity style={[styles.btn, styles.cancelBtn]}>
            <Icon style={styles.whiteText} name="md-close-circle-sharp" size={32} />
          </TouchableOpacity>
          <Spacer />
        </>
      )}

      <TouchableOpacity style={[styles.btn, styles.submitBtn]}>
        <Text style={styles.whiteText}>{t('transfer.form.transfer')}</Text>
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
  },
  cancelBtn: {
    width: 64,
    backgroundColor: colors.red,
  },
  whiteText: {
    color: '#FFF',
  },
  submitBtn: {
    height: 48,
    flex: 1,
    backgroundColor: colors.green,
  },
});
