import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, StyleSheet, View} from 'react-native';

import globalStyles from 'constants/styles';
import {ContractType} from 'services/config';
import Spacer from 'components/Spacer';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import PullToRefresh from 'components/PullToRefresh/PullToRefresh';
import RefreshControl from 'components/RefreshControl/RefreshControl';
import {WithdrawSection} from 'screens/Withdraw/components/WithdrawSection';
import {TransferForm, TTransferFormData} from 'screens/Withdraw/components/TransferForm';
import {isWeb} from 'utilities/helpers/web';
import {useSettings} from 'utilities/hooks/useSettings';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import usePlanterStatusQuery from 'utilities/hooks/usePlanterStatusQuery';
import {sendTransactionWithGSN} from 'utilities/helpers/sendTransaction';
import {useConfig, usePlanterFund, useWalletAccount, useWalletWeb3} from 'utilities/hooks/useWeb3';
import {useProfile} from '../../../../redux/modules/profile/profile';
import {useContracts} from '../../../../redux/modules/contracts/contracts';

export function TransferScreen() {
  const requiredBalance = useMemo(() => 500000000000000000, []);

  const [minBalance, setMinBalance] = useState<number>(requiredBalance);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const {t} = useTranslation();

  const {dai, getBalance, loading: contractsLoading, submitTransaction} = useContracts();
  const {sendEvent} = useAnalytics();
  const {useGSN} = useSettings();
  const {profile} = useProfile();

  const planterFundContract = usePlanterFund();
  const wallet = useWalletAccount();
  const web3 = useWalletWeb3();
  const config = useConfig();
  const isConnected = useNetInfoConnected();

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

  const getPlanter = useCallback(async () => {
    if (!isConnected) {
      return;
    }
    try {
      await planterRefetch();
      await getMinBalance();
    } catch (e) {
      console.log(e, 'e is hereeeeee getPlanter');
    }
  }, [getMinBalance, isConnected, planterRefetch]);

  const parseBalance = useCallback(
    (balance: string, fixed = 5) => parseFloat(web3?.utils?.fromWei(balance))?.toFixed(fixed),
    [web3?.utils],
  );

  const planterWithdrawableBalance = useMemo(
    () => (Number(planterData?.balance) > 0 ? parseBalance(planterData?.balance.toString() || '0') : 0),
    [planterData, parseBalance],
  );

  console.log(planterWithdrawableBalance, 'planterWithdrawableBalance is hereeee');

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
          await getPlanter();

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

  const handleSubmitTransaction = useCallback(
    (data: TTransferFormData) => {
      submitTransaction(data);
    },
    [submitTransaction],
  );

  const handleRefetch = useCallback(
    () =>
      new Promise((resolve: any, reject: any) => {
        return (async () => {
          await getPlanter();
          await getBalance();
          resolve();
        })();
      }),
    [getPlanter, getBalance],
  );

  // const loading = useMemo(() => contractsLoading || refetching, [refetching, contractsLoading]);

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <ScreenTitle title={t('withdraw')} goBack />
      <PullToRefresh onRefresh={handleRefetch}>
        <ScrollView
          style={[globalStyles.screenView, globalStyles.fill]}
          refreshControl={isWeb() ? undefined : <RefreshControl refreshing={refetching} onRefresh={handleRefetch} />}
        >
          {isWeb() && <Spacer times={4} />}
          <View style={styles.container}>
            <WithdrawSection
              handleWithdraw={handleWithdrawPlanterBalance}
              planterWithdrawableBalance={planterWithdrawableBalance}
              dai={dai}
              submitting={submitting}
            />
            {dai ? <TransferForm userWallet={wallet} handleSubmit={handleSubmitTransaction} /> : null}
            <Spacer times={8} />
          </View>
        </ScrollView>
      </PullToRefresh>
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
