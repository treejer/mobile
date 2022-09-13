import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, StyleSheet, View} from 'react-native';

import globalStyles from 'constants/styles';
import {ContractType} from 'services/config';
import Spacer from 'components/Spacer';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import PullToRefresh from 'components/PullToRefresh/PullToRefresh';
import {WithdrawHistory} from 'components/Withdraw/WithdrawHistory';
import RefreshControl from 'components/RefreshControl/RefreshControl';
import {WithdrawSection} from 'screens/Withdraw/components/WithdrawSection';
import {TransferForm} from 'screens/Withdraw/components/TransferForm';
import {isWeb} from 'utilities/helpers/web';
import {useSettings} from 'utilities/hooks/useSettings';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import usePlanterStatusQuery from 'utilities/hooks/usePlanterStatusQuery';
import {sendTransactionWithGSN} from 'utilities/helpers/sendTransaction';
import {useConfig, usePlanterFund, useWalletAccount, useWalletWeb3} from 'utilities/hooks/useWeb3';
import {history} from 'screens/Withdraw/screens/WithrawHistory/WithdrawHistory';
import {useProfile} from '../../../../redux/modules/profile/profile';
import {useContracts} from '../../../../redux/modules/contracts/contracts';

export function TransferScreen() {
  const requiredBalance = useMemo(() => 500000000000000000, []);

  const [minBalance, setMinBalance] = useState<number>(requiredBalance);
  const [redeeming, setRedeeming] = useState<boolean>(false);

  const {t} = useTranslation();
  const {sendEvent} = useAnalytics();

  const {
    dai,
    getBalance,
    fee,
    loading: contractsLoading,
    submitTransaction,
    estimateGasPrice,
    cancelTransaction,
    submitting,
  } = useContracts();

  const {useGSN} = useSettings();
  const wallet = useWalletAccount();
  const web3 = useWalletWeb3();
  const config = useConfig();
  const {profile} = useProfile();
  const planterFundContract = usePlanterFund();

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
    setRedeeming(true);
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
      setRedeeming(false);
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

  const handleRefetch = useCallback(
    () =>
      new Promise((resolve: any) => {
        return (async () => {
          if (isConnected) {
            getBalance();
            await getPlanter();
            resolve();
          }
        })();
      }),
    [getPlanter, getBalance, isConnected],
  );

  const loading = useMemo(() => contractsLoading || refetching, [refetching, contractsLoading]);

  useEffect(() => {
    console.log({
      contractsLoading,
      refetching,
      loading,
    });
  }, [refetching, contractsLoading, loading]);

  const daiBalance = useMemo(() => Number(web3.utils.fromWei(dai)), [dai]);

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <ScreenTitle title={t('withdraw')} goBack />
      <PullToRefresh onRefresh={handleRefetch}>
        <ScrollView
          style={[globalStyles.screenView, globalStyles.fill]}
          refreshControl={isWeb() ? undefined : <RefreshControl refreshing={loading} onRefresh={handleRefetch} />}
        >
          {isWeb() && <Spacer times={4} />}
          <View style={styles.container}>
            <WithdrawSection
              history={history}
              loading={loading}
              handleWithdraw={handleWithdrawPlanterBalance}
              planterWithdrawableBalance={planterWithdrawableBalance}
              daiBalance={daiBalance}
              redeeming={redeeming}
            />
            {!daiBalance && !planterWithdrawableBalance ? (
              history?.length ? (
                <>
                  <Spacer times={12} />
                  <WithdrawHistory withdrawHistory={history} />
                </>
              ) : null
            ) : (
              !!daiBalance && (
                <TransferForm
                  hasHistory={!!history?.length}
                  daiBalance={dai}
                  userWallet={wallet}
                  fee={fee}
                  submitting={submitting}
                  handleSubmitTransaction={submitTransaction}
                  handleEstimateGasPrice={estimateGasPrice}
                  handleCancelTransaction={cancelTransaction}
                />
              )
            )}
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
