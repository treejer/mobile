import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, View} from 'react-native';

import globalStyles from 'constants/styles';
import {ContractType} from 'services/config';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {WithdrawSection} from 'screens/Withdraw/components/WithdrawSection';
import {TransferForm} from 'screens/Withdraw/components/TransferForm';
import usePlanterStatusQuery from 'utilities/hooks/usePlanterStatusQuery';
import {sendTransactionWithGSN} from 'utilities/helpers/sendTransaction';
import {useSettings} from 'utilities/hooks/useSettings';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {useConfig, usePlanterFund, useWalletAccount, useWalletWeb3} from 'utilities/hooks/useWeb3';
import {useProfile} from '../../../../redux/modules/profile/profile';
import {useContracts} from '../../../../redux/modules/contracts/contracts';

export function Transfer() {
  const requiredBalance = useMemo(() => 500000000000000000, []);

  const [minBalance, setMinBalance] = useState<number>(requiredBalance);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const {t} = useTranslation();

  const {dai, getBalance} = useContracts();
  const {sendEvent} = useAnalytics();
  const {useGSN} = useSettings();
  const {profile} = useProfile();

  const planterFundContract = usePlanterFund();
  const wallet = useWalletAccount();
  const web3 = useWalletWeb3();
  const isConnected = useNetInfoConnected();
  const config = useConfig();

  const isVerified = profile?.isVerified;
  const skipStats = !wallet || !isVerified;

  const {
    data: planterData,
    refetchPlanterStatus: planterRefetch,
    refetching,
  } = usePlanterStatusQuery(wallet, skipStats);

  const getMinBalance = useCallback(() => {
    // @here
    planterFundContract.methods
      .minWithdrawable()
      .call()
      .then(balance => {
        setMinBalance(balance);
      })
      .catch(e => {
        console.log(e, 'e inside get minWithdrawable');
        setMinBalance(requiredBalance);
      });
  }, []);

  const parseBalance = useCallback(
    (balance: string, fixed = 5) => parseFloat(web3?.utils?.fromWei(balance))?.toFixed(fixed),
    [web3?.utils],
  );

  const planterWithdrawableBalance =
    Number(planterData?.balance) > 0 ? parseBalance(planterData?.balance.toString() || '0') : 0;

  useEffect(() => {
    (async () => {
      await getMinBalance();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWithdrawPlanterBalance = useCallback(async () => {
    if (!isConnected) {
      showAlert({
        title: t('netInfo.error'),
        message: t('netInfo.details'),
        mode: AlertMode.Error,
      });
      return;
    }
    setSubmitting(true);
    sendEvent('withdraw');
    try {
      // balance
      const balance = parseBalance(planterData?.balance?.toString() || '0');
      const bnMinBalance = parseBalance((minBalance || requiredBalance).toString());
      if (balance > bnMinBalance) {
        try {
          const transaction = await sendTransactionWithGSN(
            config,
            ContractType.PlanterFund,
            web3,
            wallet,
            'withdrawBalance',
            [planterData?.balance.toString()],
            useGSN,
          );

          getBalance();

          console.log('transaction', transaction);
          showAlert({
            title: t('success'),
            message: t('myProfile.withdraw.success'),
            mode: AlertMode.Success,
          });
        } catch (e: any) {
          showAlert({
            title: t('failure'),
            message: e?.message || t('sthWrong'),
            mode: AlertMode.Error,
          });
        }
      } else {
        showAlert({
          title: t('myProfile.attention'),
          message: t('myProfile.lessBalance', {amount: parseBalance(minBalance?.toString())}),
          mode: AlertMode.Info,
        });
      }
    } catch (error: any) {
      showAlert({
        title: t('error'),
        message: error?.message,
        mode: AlertMode.Error,
      });
      console.warn('Error', error);
    } finally {
      setSubmitting(false);
    }
  }, [
    isConnected,
    sendEvent,
    t,
    parseBalance,
    planterData?.balance,
    minBalance,
    requiredBalance,
    config,
    web3,
    wallet,
    useGSN,
  ]);

  return (
    <SafeAreaView style={[{flex: 1}, globalStyles.screenView]}>
      <ScreenTitle title={t('withdraw')} goBack />
      <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
        <View style={[styles.container]}>
          <WithdrawSection
            handleWithdraw={handleWithdrawPlanterBalance}
            planterWithdrawableBalance={planterWithdrawableBalance}
            dai={dai}
            submitting={submitting}
          />
          {dai ? <TransferForm userWallet={wallet} /> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    ...globalStyles.fill,
    ...globalStyles.screenView,
    ...globalStyles.alignItemsCenter,
    paddingBottom: 12,
  },
};
