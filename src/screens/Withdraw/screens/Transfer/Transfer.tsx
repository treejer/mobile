import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {ScrollView, View, Text} from 'react-native';

import {AboutWithdraw} from 'components/Transfer/AboutWithdraw';
import Spacer from 'components/Spacer';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {DaiCoinBalance} from 'components/Transfer/DaiCoinBalance';
import usePlanterStatusQuery from 'utilities/hooks/usePlanterStatusQuery';
import {useConfig, usePlanterFund, useWalletAccount, useWalletWeb3} from 'utilities/hooks/useWeb3';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {sendTransactionWithGSN} from 'utilities/helpers/sendTransaction';
import {ContractType} from 'services/config';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {useSettings} from 'utilities/hooks/useSettings';
import Button from 'components/Button';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import globalStyles from 'constants/styles';
import {useProfile} from '../../../../redux/modules/profile/profile';
import {WithdrawSection} from 'components/Transfer/WithdrawSection';

export function Transfer() {
  const requiredBalance = useMemo(() => 500000000000000000, []);

  const [minBalance, setMinBalance] = useState<number>(requiredBalance);
  const [dai, setDai] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const {t} = useTranslation();

  const {sendEvent} = useAnalytics();
  const planterFundContract = usePlanterFund();
  const wallet = useWalletAccount();
  const web3 = useWalletWeb3();
  const isConnected = useNetInfoConnected();
  const config = useConfig();
  const {useGSN} = useSettings();
  const {profile} = useProfile();
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

  const handleGetBalance = useCallback(async () => {
    setDai(null);
    // setEther(null);
    try {
      const contract = config.contracts.Dai;
      const ethContract = new web3.eth.Contract(contract.abi as any, contract.address);
      const walletBalance = await ethContract.methods.balanceOf(wallet).call();
      setDai(web3.utils.fromWei(walletBalance));
      const balance = await web3.eth.getBalance(wallet);
      // setEther(web3.utils.fromWei(balance));
    } catch (e) {
      console.log(e, 'error handleGetBalance');
    }
  }, [config.contracts.Dai, wallet, web3.eth, web3.utils]);

  useEffect(() => {
    (async () => {
      await getMinBalance();
      await handleGetBalance();
      setLoading(false);
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

  if (loading) {
    return (
      <SafeAreaView style={[{flex: 1}, globalStyles.screenView]}>
        <ScreenTitle title={t('withdraw')} goBack />
        <View style={globalStyles.alignItemsCenter}>
          <Text>loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
