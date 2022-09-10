import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import * as Yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

import {Routes} from 'navigation';
import {TransferInput} from 'components/Withdraw/TransferInput';
import {QrReader} from 'components/QrReader/QrReader';
import Spacer from 'components/Spacer';
import {SubmitTransfer} from 'components/Withdraw/SubmitTransfer';
import {TransferConfirmationModal} from 'components/Withdraw/TransferConfirmationModal';
import globalStyles from 'constants/styles';
import Web3 from 'web3';
import {useWeb3} from 'utilities/hooks/useWeb3';
import BN from 'bn.js';

export type TTransferFormData = {
  from: string;
  to: string;
  amount: string;
};

export type TTransferFormError = {
  to?: string;
  amount?: string;
};

export type TTransferFormTouched = {
  to?: boolean;
  amount?: boolean;
};

export type TTransferFormProps = {
  fee: string | number | null;
  daiBalance: string | BN;
  userWallet: string;
  submitting: boolean;
  handleSubmitTransaction: (data: TTransferFormData) => void;
  handleEstimateGasPrice: (data: TTransferFormData) => void;
  handleCancelTransaction: () => void;
};

const schema = (maxAmount: string | BN, web3: Web3) =>
  Yup.object().shape({
    to: Yup.string()
      .required('Recipient address field is required')
      .min(42, 'Recipient address should be bigger than 41')
      .max(64, 'Recipient address should be lower than 65'),
    amount: Yup.string()
      .required('Amount field is required')
      .test('mamad', `mount should be lower than your dai balance`, (value: BN | string | undefined) => {
        if (value === '0') {
          value = web3.utils.toWei(value);
          console.log(value, maxAmount, 'is hereeeeeeeee');
          return value < maxAmount;
        } else {
          return false;
        }
      }),
  });

export function TransferForm(props: TTransferFormProps) {
  const {
    userWallet,
    fee,
    daiBalance,
    handleSubmitTransaction,
    handleEstimateGasPrice,
    handleCancelTransaction,
    submitting,
  } = props;

  const [transferData, setTransferData] = useState<TTransferFormData>({from: userWallet, to: '', amount: ''});
  const [showQrReader, setShowQrReader] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const defaultValues = useMemo(() => ({from: userWallet, to: '', amount: ''}), []);

  const web3 = useWeb3();

  const {control, handleSubmit, formState, getValues, setValue} = useForm<TTransferFormData>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema(daiBalance.toString(), web3)),
    defaultValues,
  });

  useEffect(() => {
    console.log(formState.errors, 'error is here');
    console.log(formState.touchedFields, 'touched is here');
  }, [formState]);

  const {t} = useTranslation();
  const navigation = useNavigation();

  const handleSubmitTransfer = useCallback(
    data => {
      console.log(data, 'transfer form data is mamadhere');
      setShowConfirmModal(false);
      // handleSubmitTransaction(transferData);
    },
    [transferData],
  );

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
    setValue('to', text);
    setTransferData({...transferData, to: text});
  }, [transferData]);

  const handleScanQrCode = useCallback(
    (data: string) => {
      setValue('to', data);
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

  const handleCalcMacAmount = useCallback(() => {
    setValue('amount', web3.utils.fromWei(daiBalance));
  }, []);

  const handleClearForm = useCallback(() => {
    setTransferData({
      ...transferData,
      amount: '',
      to: '',
    });
  }, []);

  const handleEstimate = useCallback(() => {
    setShowConfirmModal(true);
    // handleEstimateGasPrice(transferData);
  }, [handleEstimateGasPrice, transferData]);

  const handleCloseConfirmModal = useCallback(() => {
    setShowConfirmModal(false);
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
      {showConfirmModal ? (
        <TransferConfirmationModal
          onConfirm={handleSubmit(handleSubmitTransfer)}
          onCancel={handleCloseConfirmModal}
          amount={getValues().to}
          address={getValues().amount}
          fee={fee}
        />
      ) : null}
      <Spacer times={4} />
      <TransferInput
        control={control}
        name="from"
        label="from"
        value={transferData.from}
        onChangeText={handleChange}
        disabled
      />
      <Spacer />
      <TransferInput
        control={control}
        name="to"
        label="to"
        disabled={submitting}
        placeholder={t('transfer.form.toHolder')}
        value={transferData.to}
        onChangeText={handleChange}
        onPaste={handlePasteClipboard}
        openQRReader={handleOpenQrReader}
        error={formState.touchedFields.to && formState.errors.to ? formState.errors.to.message : undefined}
      />
      <Spacer />
      <TransferInput
        control={control}
        name="amount"
        label="amount"
        disabled={submitting}
        placeholder={t('transfer.form.amountHolder')}
        preview={transferData.amount}
        value={transferData.amount}
        onChangeText={handleChange}
        calcMax={handleCalcMacAmount}
        error={formState.touchedFields.amount && formState.errors.amount ? formState.errors.amount.message : undefined}
      />
      <Spacer times={8} />
      <SubmitTransfer
        hasHistory={true}
        disabled={!formState.isValid}
        loading={submitting}
        onCancel={handleClearForm}
        onSubmit={handleEstimate}
        onHistory={handleNavigateHistory}
      />
    </View>
  );
}
