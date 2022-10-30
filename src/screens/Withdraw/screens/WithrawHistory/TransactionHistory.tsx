import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import globalStyles from 'constants/styles';
import Spacer from 'components/Spacer';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {TransactionList} from 'components/Withdraw/TransactionList';
import {FilterList} from 'components/Filter/FilterList';
import {TTransactionEvent} from 'components/Withdraw/TransactionItem';
import {useGetTransactionHistory} from 'utilities/hooks/useGetTransactionHistory';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';
import {useDebounce} from 'utilities/hooks/useDebounce';
import {useWalletAccount} from '../../../../redux/modules/web3/web3';

export const historyCategories = ['all', TTransactionEvent.TransferOut, TTransactionEvent.TransferIn];

export function WithdrawHistoryScreen() {
  const {t} = useTranslation();

  const wallet = useWalletAccount();

  const [filters, setFilters] = useState<TTransactionEvent[]>([]);
  const debouncedFilters = useDebounce<TTransactionEvent[]>(filters, 200);

  const {
    query: txHistoryQuery,
    persistedData: txHistory,
    refetching: txHistoryRefetching,
    refetchData: refetchTxHistory,
    loadMore: txHistoryLoadMore,
  } = useGetTransactionHistory(wallet, debouncedFilters);

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

  const handleSelectFilterOption = useCallback(
    async (option: string) => {
      if (!filters.some(filter => filter === option)) {
        if (option === 'all') return setFilters([]);
        setFilters(
          filters.length === historyCategories.length - 2 ? [] : ([...filters, option] as TTransactionEvent[]),
        );
      } else {
        setFilters(filters.filter(filter => filter !== option));
      }
    },
    [filters],
  );

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <View>
        <ScreenTitle title={t('transfer.transactionHistory')} goBack />
      </View>
      <View style={styles.container}>
        <FilterList categories={historyCategories} filters={filters} onFilterOption={handleSelectFilterOption} />
        <TransactionList
          showHeader={false}
          history={txHistory}
          onRefresh={refetchTxHistory}
          refreshing={txHistoryRefetching || txHistoryQuery.loading}
          onLoadMore={txHistoryLoadMore}
        />
        <Spacer times={4} />
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
