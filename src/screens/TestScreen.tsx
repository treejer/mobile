import React, {useState} from 'react';
import globalStyles from 'constants/styles';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DaiCoinBalance} from 'components/Transfer/DaiCoinBalance';
import Spacer from 'components/Spacer';
import {TransferInput} from 'components/Transfer/TransferInput';
import {useTranslation} from 'react-i18next';
import {TransferConfirmationModal} from 'components/Transfer/TransferConfirmationModal';
import {SubmitTransfer} from 'components/Transfer/SubmitTransfer';

export function TestScreen() {
  const [confirming, setConfirming] = useState(true);
  const {t} = useTranslation();

  return (
    <SafeAreaView style={globalStyles.fill}>
      {confirming && (
        <TransferConfirmationModal
          onCancel={() => setConfirming(false)}
          onConfirm={() => setConfirming(false)}
          address="sfdfdsafsdafsadfadsfasdfsdffsdfdasfadsfasdffasfsd"
          amount="5.34 DAI"
        />
      )}
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
        <Spacer times={10} />
        <SubmitTransfer disabled={true} />
        <Spacer />
        <SubmitTransfer disabled={false} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
