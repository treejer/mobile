import React, {useCallback, useMemo, useState} from 'react';
import {Modal, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import Web3 from 'web3';

import Card from 'components/Card';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {colors} from 'constants/values';

export type TTransferConfirmationModalProps = {
  onConfirm: () => void;
  onCancel: () => void;
  amount: string;
  address: string;
  fee: string | number | null;
};

export function TransferConfirmationModal(props: TTransferConfirmationModalProps) {
  const {address, amount, onCancel, onConfirm, fee} = props;

  const [isConfirmed, setIsConfirmed] = useState(false);

  const {t} = useTranslation();

  const transactionFee = useMemo(() => (fee ? Web3.utils.fromWei(fee.toString(), 'ether') : null), [fee]);

  const handleConfirmAndClose = useCallback(() => {
    onConfirm();
    setIsConfirmed(true);
  }, [onConfirm]);

  return !isConfirmed ? (
    <Modal transparent>
      <View style={styles.container}>
        <Card style={styles.confirmBox}>
          <View style={styles.row}>
            <Text style={styles.title}>{t('transfer.form.confirm.title')}</Text>
            <TouchableOpacity onPress={onCancel}>
              <Icon style={styles.blackTxt} name="close" size={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.hr} />
          <View>
            <View style={styles.row}>
              <Text style={styles.detail}>{t('transfer.form.toHolder')}</Text>
              <Text style={[styles.detail, styles.values]} numberOfLines={3}>
                {address}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.detail}>{t('transfer.form.amount')}</Text>
              <Text style={[styles.detail, styles.values]} numberOfLines={5}>
                {amount} {t('dai')} ~ ${amount}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.detail}>{t('transfer.fee')}</Text>
              <Text style={[styles.detail, styles.values]} numberOfLines={3}>
                {transactionFee ? transactionFee : '...'}
              </Text>
            </View>
          </View>
          <View style={styles.hr} />
          <Text style={styles.alert}>{t('transfer.form.confirm.alert')}</Text>
          <Spacer />
          <View style={[styles.row, styles.btnContainer]}>
            <Button style={styles.btn} caption={t('transfer.form.confirm.cancel')} onPress={onCancel} />
            <Button
              disabled={!transactionFee}
              style={[styles.btn, !transactionFee && styles.disabledBtn]}
              variant="success"
              caption={t('transfer.form.confirm.confirm')}
              onPress={handleConfirmAndClose}
            />
          </View>
        </Card>
      </View>
    </Modal>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.modalBg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.black,
    fontWeight: '500',
    fontSize: 16,
  },
  confirmBox: {
    width: 300,
    minHeight: 316,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.khaki,
  },
  hr: {
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 8,
  },
  blackTxt: {
    color: colors.black,
  },
  detail: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 10,
    color: colors.gray,
  },
  values: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grayDarker,
  },
  alert: {
    color: colors.red,
    fontWeight: '300',
    fontSize: 14,
  },
  btnContainer: {
    marginTop: 'auto',
  },
  btn: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  disabledBtn: {
    backgroundColor: colors.khakiDark,
    color: colors.gray,
  },
});
