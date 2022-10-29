import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItemInfo, StyleSheet, Text, View} from 'react-native';

import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {Hr} from 'components/Common/Hr';
import {TransactionItem, TTransactionHistory} from 'components/Withdraw/TransactionItem';

export type TTransactionHistoryProps = {
  history: TTransactionHistory[];
};

export function TransactionHistory(props: TTransactionHistoryProps) {
  const {history} = props;

  const {t} = useTranslation();

  const renderItem = useCallback(({item}: ListRenderItemInfo<TTransactionHistory>) => {
    return <TransactionItem transaction={item} />;
  }, []);

  return (
    <View style={globalStyles.alignItemsCenter}>
      <View style={{width: 360}}>
        <Text style={styles.title}>{t('transfer.form.history')}</Text>
        <Spacer />
        <Hr />
      </View>
      <FlatList<TTransactionHistory> data={history} renderItem={renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.grayDarker,
  },
});
