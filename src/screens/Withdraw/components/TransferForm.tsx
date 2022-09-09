import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';

import {Routes} from 'navigation';
import {TransferInput} from 'components/Withdraw/TransferInput';
import {QrReader} from 'components/QrReader/QrReader';
import Spacer from 'components/Spacer';
import {SubmitTransfer} from 'components/Withdraw/SubmitTransfer';
import {TransferConfirmationModal} from 'components/Withdraw/TransferConfirmationModal';
import globalStyles from 'constants/styles';
import {useContracts} from '../../../redux/modules/contracts/contracts';

export type TTransferFormData = {
  from: string;
  to: string;
  amount: string;
};

export type TTransferFormProps = {
  fee: string | number | null;
  userWallet: string;
  submitting: boolean;
  handleSubmit: (data: TTransferFormData) => void;
  handleEstimateGasPrice: (data: TTransferFormData) => void;
  handleCancelTransaction: () => void;
};

export function TransferForm(props: TTransferFormProps) {
  const {userWallet, handleSubmit, fee, handleEstimateGasPrice, handleCancelTransaction, submitting} = props;

  const [transferData, setTransferData] = useState<TTransferFormData>({from: userWallet, to: '', amount: ''});
  const [showQrReader, setShowQrReader] = useState<boolean>(false);
  const [confirming, setConfirming] = useState(false);

  const {t} = useTranslation();
  const navigation = useNavigation();

  const handleSubmitTransfer = useCallback(() => {
    console.log(transferData, 'transfer form data is here');
    setConfirming(false);
    handleSubmit(transferData);
  }, [transferData, handleSubmit]);

  const handleChange = useCallback(
    (name: string, text: string) => {
      setTransferData({
        ...transferData,
        [name]: text,
      });
    },
    [transferData],
  );

  const handlePasteClipboard = useCallback(async () => {
    const text = await Clipboard.getString();
    setTransferData({...transferData, to: text});
  }, [transferData]);

  const handleScanQrCode = useCallback(
    (data: string) => {
      setTransferData({...transferData, to: data});
      setShowQrReader(false);
    },
    [transferData],
  );

  const handleOpenQrReader = useCallback(() => {
    setShowQrReader(true);
  }, []);

  const handleCloseQrReader = useCallback(() => {
    setShowQrReader(false);
  }, []);

  const handleClearForm = useCallback(() => {
    setTransferData({
      ...transferData,
      amount: '',
      to: '',
    });
  }, []);

  const handleEstimate = useCallback(() => {
    setConfirming(true);
    handleEstimateGasPrice(transferData);
  }, [handleEstimateGasPrice, transferData]);

  const handleCloseConfirmModal = useCallback(() => {
    setConfirming(false);
    handleCancelTransaction();
  }, []);

  const handleNavigateHistory = useCallback(() => {
    // @ts-ignore
    navigation.navigate(Routes.WithdrawHistory);
  }, [navigation]);

  const disabled = useMemo(() => !transferData.from || !transferData.amount || !transferData.to, [transferData]);

  useEffect(() => {
    if (!submitting && !disabled) {
      handleClearForm();
    }
  }, [submitting]);

  if (showQrReader) {
    return <QrReader handleScan={handleScanQrCode} handleDismiss={handleCloseQrReader} />;
  }

  return (
    <View style={globalStyles.alignItemsCenter}>
      {confirming && fee ? (
        <TransferConfirmationModal
          onConfirm={handleSubmitTransfer}
          onCancel={handleCloseConfirmModal}
          amount={transferData.amount}
          address={transferData.to}
          fee={fee}
        />
      ) : null}
      <Spacer times={4} />
      <TransferInput name="from" label="from" value={transferData.from} onChangeText={handleChange} disabled />
      <Spacer />
      <TransferInput
        name="to"
        label="to"
        disabled={submitting}
        placeholder={t('transfer.form.toHolder')}
        value={transferData.to}
        onChangeText={handleChange}
        onPaste={handlePasteClipboard}
        openQRReader={handleOpenQrReader}
      />
      <Spacer />
      <TransferInput
        name="amount"
        label="amount"
        disabled={submitting}
        placeholder={t('transfer.form.amountHolder')}
        preview={transferData.amount}
        value={transferData.amount}
        onChangeText={handleChange}
      />
      <Spacer times={8} />
      <SubmitTransfer
        disabled={disabled}
        hasHistory={true}
        onCancel={handleClearForm}
        onSubmit={handleEstimate}
        onHistory={handleNavigateHistory}
        loading={submitting}
      />
    </View>
  );
}
