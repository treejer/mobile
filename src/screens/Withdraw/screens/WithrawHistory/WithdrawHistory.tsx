import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import globalStyles from 'constants/styles';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {useTranslation} from 'react-i18next';
import {TWithdrawHistory, WithdrawHistory} from 'components/Withdraw/WithdrawHistory';
import {SafeAreaView} from 'react-native-safe-area-context';

const history: TWithdrawHistory[] = [
  {
    id: '1',
    amount: '20.00000000000',
    date: new Date().toDateString(),
    txHash: '001213213213',
  },
  {
    id: '2',
    amount: '20.00',
    date: new Date().toDateString(),
    txHash: '001213213213',
  },
  {
    id: '3',
    amount: '20.00',
    date: new Date().toDateString(),
    txHash: '001213213213',
  },
  {
    id: '4',
    amount: '20.00',
    date: new Date().toDateString(),
    txHash: '00121321321adfsdfdsafsadfsdfads3',
  },
];

export function WithdrawHistoryScreen() {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <ScreenTitle title={t('transfer.withdrawHistory')} goBack />
      <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
        <View style={styles.container}>
          <WithdrawHistory withdrawHistory={history} />
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