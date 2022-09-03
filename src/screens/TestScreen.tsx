import React from 'react';
import globalStyles from 'constants/styles';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DaiCoinBalance} from 'components/Withdraw/DaiCoinBalance';
import Spacer from 'components/Spacer';
import {TransferInput} from 'components/Withdraw/TransferInput';
import {useTranslation} from 'react-i18next';

export function TestScreen() {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={globalStyles.fill}>
      <View style={[globalStyles.fill, globalStyles.screenView, globalStyles.pt3, globalStyles.p1]}>
        <DaiCoinBalance name="treejer" balance="30" basePrice="1.00" description />
        <Spacer />
        <DaiCoinBalance name="stablecoin" balance="10" basePrice="1.00" description />
        <Spacer />
        <DaiCoinBalance name="treejer" balance="30" basePrice="1.00" description open={false} />
        <Spacer />
        <DaiCoinBalance name="stablecoin" balance="10" basePrice="1.00" open={false} />
        <TransferInput label="from" value="asdfdsfdsfdsafsdafdasfadsfsd" disabled />
        <Spacer />
        <TransferInput
          label="to"
          value=""
          placeholder={t('transfer.form.toHolder')}
          openQRReader={() => console.log('open QR reader')}
        />
        <Spacer />
        <TransferInput label="amount" value="" placeholder={t('transfer.form.amountHolder')} preview="0.00" />
        <TransferInput label="amount" value="" placeholder={t('transfer.form.amountHolder')} preview="0.00" disabled />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
