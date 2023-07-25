import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import globalStyles from 'constants/styles';
import {ContractType} from 'services/config';
import Spacer from 'components/Spacer';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import PullToRefresh from 'components/PullToRefresh/PullToRefresh';
import {TransactionList} from 'components/Withdraw/TransactionList';
import RefreshControl from 'components/RefreshControl/RefreshControl';
import {TTransactionEvent} from 'components/Withdraw/TransactionItem';
import {FilterList} from 'components/Filter/FilterList';
import {historyCategories} from 'screens/Withdraw/screens/WithrawHistory/TransactionHistory';
import {WithdrawSection} from 'screens/Withdraw/components/WithdrawSection';
import {TransferForm} from 'screens/Withdraw/components/TransferForm';
import {isWeb} from 'utilities/helpers/web';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {sendWeb3Transaction} from 'utilities/helpers/sendTransaction';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import usePlanterStatusQuery from 'utilities/hooks/usePlanterStatusQuery';
import {useGetTransactionHistory} from 'utilities/hooks/useGetTransactionHistory';
import {useKeyboardHeight} from 'utilities/hooks/useKeyboardheight';
import {useProfile} from 'ranger-redux/modules/profile/profile';
import {useSettings} from 'ranger-redux/modules/settings/settings';
import {useContracts} from 'ranger-redux/modules/contracts/contracts';
import {useConfig, useMagic, usePlanterFund, useWalletAccount, useWalletWeb3} from 'ranger-redux/modules/web3/web3';
import {TUserStatus} from 'webServices/profile/profile';

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

  const {useBiconomy} = useSettings();
  const wallet = useWalletAccount();
  const web3 = useWalletWeb3();
  const magic = useMagic();
  const config = useConfig();
  const {profile} = useProfile();
  const planterFundContract = usePlanterFund();

  const isConnected = useNetInfoConnected();

  const isVerified = profile?.userStatus === TUserStatus.Verified;
  const skipStats = !wallet || !isVerified;

  const [filters, setFilters] = useState<TTransactionEvent[]>([]);

  const {
    query: txHistoryQuery,
    persistedData: txHistory,
    refetching: txHistoryRefetching,
    refetchData: refetchTxHistory,
    loadMore: txHistoryLoadMore,
  } = useGetTransactionHistory(wallet, filters);

  const {
    data: planterData,
    refetchPlanterStatus: planterRefetch,
    refetching,
  } = usePlanterStatusQuery(wallet, skipStats);

  const {height} = useKeyboardHeight();

  const handleSelectFilterOption = useCallback(
    async (option: string) => {
      if (!filters.some(filter => filter === option)) {
        if (option === 'all') return setFilters([]);
        setFilters(
          filters.length === historyCategories.length - 2 ? [] : ([...filters, option] as TTransactionEvent[]),
        );
      } else {
        setFilters(filters.filter(filter => filter !== option));
      }
    },
    [filters],
  );

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
          const transaction = await sendWeb3Transaction(
            magic,
            config,
            ContractType.PlanterFund,
            web3,
            wallet,
            'withdrawBalance',
            [planterData?.balance.toString()],
            useBiconomy,
          );

          getBalance();
          await getPlanter();

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
    magic,
    config,
    web3,
    wallet,
    useBiconomy,
    getBalance,
    getPlanter,
  ]);

  const handleRefetch = useCallback(
    () =>
      new Promise((resolve: any) => {
        return (async () => {
          if (isConnected) {
            getBalance();
            await getPlanter();
            await refetchTxHistory();
            resolve();
          }
        })();
      }),
    [isConnected, getBalance, getPlanter, refetchTxHistory],
  );

  const loading = useMemo(() => contractsLoading || refetching, [refetching, contractsLoading]);

  const daiBalance = useMemo(() => Number(web3.utils.fromWei(dai as string)), [dai, web3]);

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <ScreenTitle title={t('withdraw')} goBack />
      <PullToRefresh onRefresh={handleRefetch}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          style={[globalStyles.screenView, globalStyles.fill]}
          refreshControl={isWeb() ? undefined : <RefreshControl refreshing={loading} onRefresh={handleRefetch} />}
        >
          <View style={{flex: 1}}>
            {isWeb() && <Spacer times={4} />}
            <View style={styles.container}>
              <WithdrawSection
                history={txHistory}
                loading={loading}
                handleWithdraw={handleWithdrawPlanterBalance}
                planterWithdrawableBalance={planterWithdrawableBalance}
                daiBalance={daiBalance}
                redeeming={redeeming}
              />
            </View>
            {!dai && !planterWithdrawableBalance ? (
              <View style={globalStyles.alignItemsCenter}>
                <Spacer times={8} />
                <FilterList
                  categories={historyCategories}
                  filters={filters}
                  onFilterOption={handleSelectFilterOption}
                />
                <Spacer />
                <TransactionList
                  disabled={isWeb()}
                  showHeader={true}
                  history={txHistory}
                  onRefresh={refetchTxHistory}
                  refreshing={txHistoryRefetching || txHistoryQuery.loading}
                  onLoadMore={txHistoryLoadMore}
                />
              </View>
            ) : (
              !!daiBalance && (
                <TransferForm
                  hasHistory={!!txHistory?.length}
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
            <Spacer times={10} />
            {height && Platform.OS === 'android' ? <View style={{height}} /> : null}
          </View>
        </KeyboardAwareScrollView>
      </PullToRefresh>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.alignItemsCenter,
    ...globalStyles.screenView,
    ...globalStyles.fill,
    paddingBottom: 12,
  },
});
