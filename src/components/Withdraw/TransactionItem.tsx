import React, {useCallback, useMemo, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import {Hr} from 'components/Common/Hr';
import {MoreDetail} from 'components/Activity/ActivityItem';
import {GetTransactionHistoryQueryPartialData} from 'screens/Withdraw/screens/WithrawHistory/graphql/getTransactionHistoryQuery.graphql';
import {useWalletWeb3} from '../../redux/modules/web3/web3';
import {StableDaiCoin, EthCoin, Tree} from '../../../assets/images';
import globalStyles from 'constants/styles';

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
    [transaction.amount],
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
            <TouchableOpacity style={styles.row} onPress={handleOpenDetails}>
              <Text style={styles.status}>{t(`activities.${transaction.event}`)}</Text>
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
