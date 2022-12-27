import React, {useCallback, useMemo, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import {Hr} from 'components/Common/Hr';
import {MoreDetail} from 'components/Activity/ActivityItem';
import {GetTransactionHistoryQueryPartialData} from 'screens/Withdraw/screens/WithrawHistory/graphql/getTransactionHistoryQuery.graphql';
import {useWalletWeb3} from 'ranger-redux/modules/web3/web3';
import {StableDaiCoin} from '../../../assets/images';

export enum TTransactionEvent {
  TransferOut = 'TransferOut',
  TransferIn = 'TransferIn',
}

export type TTransactionHistory = GetTransactionHistoryQueryPartialData.Erc20Histories;

export type TTransactionItemProps = {
  transaction: TTransactionHistory;
  isLast: boolean;
};

export function TransactionItem(props: TTransactionItemProps) {
  const {transaction, isLast} = props;

  const [isOpen, setIsOpen] = useState(false);

  const web3 = useWalletWeb3();
  const {t} = useTranslation();

  const handleOpenDetails = useCallback(() => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  }, []);

  const date = useMemo(
    () => (transaction.createdAt ? moment(+transaction.createdAt * 1000).format('lll') : null),
    [transaction.createdAt],
  );

  const amount = useMemo(
    () => (transaction.amount ? Number(web3.utils.fromWei(transaction.amount.toString())).toFixed(2) : null),
    [transaction.amount, web3.utils],
  );

  const eventColor = useMemo(
    () => (transaction?.event === TTransactionEvent.TransferIn ? colors.green : colors.red),
    [transaction.event],
  );

  return (
    <View style={globalStyles.alignItemsCenter}>
      <Spacer />
      <View style={[styles.container, isOpen && colors.smShadow]}>
        <View style={styles.row}>
          <View style={[styles.image]}>
            <Image source={StableDaiCoin} style={styles.image} />
          </View>
          <Spacer />
          <View style={[styles.row, styles.detail]}>
            <View>
              <Text style={styles.title}>{amount}</Text>
              <Spacer times={0.5} />
              <Text style={styles.date}>{date}</Text>
            </View>
            <View style={styles.row}>
              <MIcon
                name={transaction.event === TTransactionEvent.TransferIn ? 'wallet-plus-outline' : 'bank-transfer-out'}
                color={eventColor}
                size={18}
              />
              <Spacer />
              <TouchableOpacity style={styles.row} onPress={handleOpenDetails}>
                <Text style={[styles.status, {color: eventColor}]}>{t(`activities.${transaction.event}`)}</Text>
                <Spacer />
                <FIcon
                  style={{marginTop: 4, transform: [{rotate: isOpen ? '180deg' : '0deg'}]}}
                  name="chevron-down"
                  size={20}
                  color={colors.grayLight}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {isOpen && (
          <>
            <Spacer />
            <Hr styles={{width: '100%'}} />
            <Spacer times={4} />
            <MoreDetail t={t} txHash={transaction.transactionHash} />
          </>
        )}
      </View>
      <Spacer />
      {!isOpen && !isLast && <Hr styles={{width: 340, marginBottom: 8}} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 358,
    padding: 8,
    backgroundColor: colors.khaki,
    borderRadius: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detail: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: colors.grayDarker,
    justifyContent: 'center',
  },
  date: {
    fontSize: 10,
    color: colors.grayOpacity,
  },
  status: {
    fontSize: 12,
    color: colors.grayLight,
  },
});
