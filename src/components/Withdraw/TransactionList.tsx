import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {Hr} from 'components/Common/Hr';
import {TransactionItem, TTransactionHistory} from 'components/Withdraw/TransactionItem';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import {isWeb} from 'utilities/helpers/web';
import RefreshControl from 'components/RefreshControl/RefreshControl';
import {EmptyList} from 'components/Common/EmptyList';
import PullToRefresh from 'components/PullToRefresh/PullToRefresh';

export type TTransactionHistoryProps = {
  showHeader: boolean;
  history: TTransactionHistory[] | null;
  refreshing: boolean;
  onLoadMore: () => void;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
};

export function TransactionList(props: TTransactionHistoryProps) {
  const {showHeader, history, refreshing, disabled, onLoadMore, onRefresh} = props;

  const {t} = useTranslation();

  const renderItem = useCallback(
    ({item, index}: ListRenderItemInfo<TTransactionHistory>) => {
      return (
        <View style={globalStyles.alignItemsCenter}>
          <TransactionItem transaction={item} isLast={(history && history?.length - 1) === index} />
        </View>
      );
    },
    [history],
  );

  return (
    <View style={styles.container}>
      <View style={styles.listWrapper}>
        {!refreshing && showHeader && (
          <View style={styles.wFull}>
            <Text style={styles.title}>{t('transfer.form.history')}</Text>
            <Spacer />
            <Hr />
            <Spacer />
          </View>
        )}
        <View style={[globalStyles.fill, globalStyles.screenView]}>
          {refreshing ? (
            <View
              style={[
                globalStyles.fill,
                globalStyles.alignItemsCenter,
                globalStyles.justifyContentCenter,
                styles.loadingContainer,
              ]}
            >
              <ActivityIndicator size="large" color={colors.green} />
            </View>
          ) : (
            <PullToRefresh disabled={disabled} onRefresh={onRefresh}>
              <FlashList<TTransactionHistory>
                refreshing
                onRefresh={onRefresh}
                data={history}
                renderItem={renderItem}
                estimatedItemSize={100}
                ListEmptyComponent={() => <EmptyList />}
                showsVerticalScrollIndicator={false}
                refreshControl={isWeb() ? undefined : <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                onEndReachedThreshold={0.1}
                onEndReached={history?.length === 40 ? onLoadMore : undefined}
                keyExtractor={item => (item.id as string).toString()}
              />
              <Spacer times={6} />
            </PullToRefresh>
          )}
          <Spacer times={4} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.alignItemsCenter,
    flex: 1,
  },
  listWrapper: {
    width: 360,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.grayDarker,
  },
  wFull: {
    width: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
