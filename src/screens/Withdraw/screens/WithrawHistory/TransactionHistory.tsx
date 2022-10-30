import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import globalStyles from 'constants/styles';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {TransactionList} from 'components/Withdraw/TransactionList';
import {useGetTransactionHistory} from 'utilities/hooks/useGetTransactionHistory';
import {useWalletAccount} from '../../../../redux/modules/web3/web3';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';

export function WithdrawHistoryScreen() {
  const {t} = useTranslation();

  const wallet = useWalletAccount();

  const {
    query: txHistoryQuery,
    persistedData: txHistory,
    refetching: txHistoryRefetching,
    refetchData: refetchTxHistory,
    loadMore: txHistoryLoadMore,
  } = useGetTransactionHistory(wallet);

  useEffect(() => {
    (async () => {
      await refetchTxHistory();
    })();
  }, []);

  useRefocusEffect(() => {
    (async () => {
      await refetchTxHistory();
    })();
  });

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <View>
        <ScreenTitle title={t('transfer.transactionHistory')} goBack />
      </View>
      <View style={styles.container}>
        <TransactionList
          showHeader={false}
          history={txHistory}
          onRefresh={refetchTxHistory}
          refreshing={txHistoryRefetching || txHistoryQuery.loading}
          onLoadMore={txHistoryLoadMore}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 12,
    flex: 1,
  },
});
