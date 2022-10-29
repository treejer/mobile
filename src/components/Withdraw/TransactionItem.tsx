import React, {useCallback, useMemo, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import {Hr} from 'components/Common/Hr';
import {MoreDetail} from 'components/Activity/ActivityItem';
import {GetTransactionHistoryQueryPartialData} from 'screens/Withdraw/screens/WithrawHistory/graphql/getTranactionHistoryQuery.graphql';
import {useWalletWeb3} from '../../redux/modules/web3/web3';
import {StableDaiCoin, EthCoin} from '../../../assets/images';

export type TTransactionHistory = GetTransactionHistoryQueryPartialData.Erc20Histories;

export type TTransactionItemProps = {
  transaction: TTransactionHistory;
};

export function TransactionItem(props: TTransactionItemProps) {
  const {transaction} = props;

  const [isOpen, setIsOpen] = useState(false);

  const web3 = useWalletWeb3();
  const {t} = useTranslation();

  const handleOpenDetails = useCallback(() => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  }, []);

  const date = useMemo(() => moment(transaction.createdAt).format('lll'), [transaction.createdAt]);

  const amount = useMemo(
    () => (transaction.amount ? web3.utils.fromWei(transaction.amount.toString()) : null),
    [transaction.amount],
  );

  return (
    <View style={[styles.container, isOpen && colors.smShadow]}>
      <View style={styles.row}>
        <Image source={StableDaiCoin} style={styles.image} />
        <Spacer />
        <View style={[styles.row, styles.detail]}>
          <View>
            <Text style={styles.title}>{amount}</Text>
            <Spacer times={0.5} />
            <Text style={styles.date}>{date}</Text>
          </View>
          <TouchableOpacity style={styles.row} onPress={handleOpenDetails}>
            <Text style={styles.status}>event</Text>
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
  );
}

const styles = StyleSheet.create({
  // open: {
  // marginTop: -9,
  // marginBottom: 24,
  // },
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
