import React, {useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Clipboard from '@react-native-clipboard/clipboard';

import {TransferInput} from 'components/Transfer/TransferInput';
import {QrReader} from 'components/QrReader/QrReader';
import Spacer from 'components/Spacer';
import {SubmitTransfer} from 'components/Transfer/SubmitTransfer';
import {TransferConfirmationModal} from 'components/Transfer/TransferConfirmationModal';
import globalStyles from 'constants/styles';

export type TTransferFormData = {
  userWallet: string;
  goalWallet: string;
  amount: string;
};

export type TTransferFormProps = {
  userWallet: string;
};

export function TransferForm(props: TTransferFormProps) {
  const {userWallet} = props;

  const [transferData, setTransferData] = useState<TTransferFormData>({userWallet, goalWallet: '', amount: ''});
  const [showQrReader, setShowQrReader] = useState<boolean>(false);
  const [confirming, setConfirming] = useState(false);

  const {t} = useTranslation();

  const handleSubmitTransfer = useCallback(() => {
    console.log(transferData, 'transfer form data is here');
    setConfirming(false);
    handleClearForm();
  }, [transferData]);

  const handleChange = useCallback(
    (name: string, text: string) => {
      setTransferData({
        ...transferData,
        [name]: text,
      });
    },
    [transferData],
  );

  const handleScanQrCode = useCallback(
    (data: string) => {
      setTransferData({...transferData, goalWallet: data});
      setShowQrReader(false);
    },
    [transferData],
  );

  const handlePasteClipboard = useCallback(async () => {
    const text = await Clipboard.getString();
    setTransferData({...transferData, goalWallet: text});
  }, [transferData]);

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
      goalWallet: '',
    });
  }, []);

  const disabled = useMemo(
    () => !transferData.goalWallet || !transferData.amount || !transferData.userWallet,
    [transferData],
  );

  if (showQrReader) {
    return <QrReader handleScan={handleScanQrCode} handleDismiss={handleCloseQrReader} />;
  }

  return (
    <View style={globalStyles.alignItemsCenter}>
      {confirming && (
        <TransferConfirmationModal
          onConfirm={handleSubmitTransfer}
          onCancel={() => setConfirming(false)}
          amount={transferData.amount}
          address={transferData.goalWallet}
        />
      )}
      <Spacer times={4} />
      <TransferInput
        name="userWallet"
        label="from"
        value={transferData.userWallet}
        onChangeText={handleChange}
        disabled
      />
      <Spacer />
      <TransferInput
        name="goalWallet"
        label="to"
        placeholder={t('transfer.form.toHolder')}
        value={transferData.goalWallet}
        onChangeText={handleChange}
        onPaste={handlePasteClipboard}
        openQRReader={handleOpenQrReader}
      />
      <Spacer />
      <TransferInput
        name="amount"
        placeholder={t('transfer.form.amountHolder')}
        label="amount"
        value={transferData.amount}
        onChangeText={handleChange}
      />
      <Spacer times={10} />
      <SubmitTransfer
        disabled={disabled}
        hasHistory={false}
        onCancel={handleClearForm}
        onSubmit={() => setConfirming(true)}
        onHistory={() => console.log('history button clicked')}
      />
    </View>
  );
}
