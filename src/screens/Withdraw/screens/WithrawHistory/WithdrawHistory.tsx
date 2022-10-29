import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import globalStyles from 'constants/styles';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {TransactionHistory} from 'components/Withdraw/TransactionHistory';
import {TTransactionHistory} from 'components/Withdraw/TransactionItem';

// export const history = [
//   {
//     id: '1',
//     amount: '20.00000000000',
//     date: new Date().toDateString(),
//     txHash: '001213213213',
//   },
//   {
//     id: '2',
//     amount: '20.00',
//     date: new Date().toDateString(),
//     txHash: '001213213213',
//   },
//   {
//     id: '3',
//     amount: '20.00',
//     date: new Date().toDateString(),
//     txHash: '001213213213',
//   },
//   {
//     id: '4',
//     amount: '20.00',
//     date: new Date().toDateString(),
//     txHash: '00121321321adfsdfdsafsadfsdfads3',
//   },
// ];

export const history: TTransactionHistory[] = [];

export function WithdrawHistoryScreen() {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <ScreenTitle title={t('transfer.withdrawHistory')} goBack />
      <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
        <View style={styles.container}>
          {history && history?.length ? <TransactionHistory history={history} /> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.fill,
    ...globalStyles.screenView,
    ...globalStyles.alignItemsCenter,
    paddingBottom: 12,
  },
});
