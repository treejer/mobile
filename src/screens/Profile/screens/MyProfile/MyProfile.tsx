import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, RefreshControl, Alert, Linking, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import ShimmerPlaceholder from 'components/ShimmerPlaceholder';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Avatar from 'components/Avatar';
import {sendTransactionWithGSN} from 'utilities/helpers/sendTransaction';
import {useWalletAccount, useResetWeb3Data, useWalletWeb3, usePlanterFund} from 'services/web3';
import {useCurrentUser, UserStatus} from 'services/currentUser';
import config from 'services/config';
import {useSettings} from 'services/settings';
import {offlineTreesStorageKey, offlineUpdatedTreesStorageKey, useOfflineTrees} from 'utilities/hooks/useOfflineTrees';
import {asyncAlert} from 'utilities/helpers/alert';
import usePlanterStatusQuery from 'utilities/hooks/usePlanterStatusQuery';
import {useTranslation} from 'react-i18next';
import Invite from 'screens/Profile/screens/MyProfile/Invite';
import SimpleToast from 'react-native-simple-toast';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import Clipboard from '@react-native-clipboard/clipboard';
import AppVersion from 'components/AppVersion';

interface Props {
  navigation: any;
}

function MyProfile(_: Props) {
  const {t} = useTranslation();
  const [minBalance, setMinBalance] = useState(null);
  const navigation = useNavigation();
  const web3 = useWalletWeb3();
  const wallet = useWalletAccount();
  const {resetOnBoardingData} = useSettings();
  const {resetWeb3Data} = useResetWeb3Data();

  const planterFundContract = usePlanterFund();

  const {sendEvent} = useAnalytics();

  const {data, loading, status, statusCode, refetchUser} = useCurrentUser();
  const isVerified = data?.user?.isVerified;
  const {offlineTrees} = useOfflineTrees();

  const requiredBalance = useMemo(() => 500000000000000000, []);

  // const minBalanceQuery = useQuery<PlanterMinWithdrawableBalanceQueryQueryData>(planterMinWithdrawQuery, {
  //   variables: {},
  //   fetchPolicy: 'cache-first',
  // });

  // @here This useEffect should be a hook or fix minBalanceQuery method
  useEffect(() => {
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
  }, [planterFundContract.methods, requiredBalance]);

  const skipStats = !wallet || !isVerified;

  const {
    data: planterData,
    refetchPlanterStatus: planterRefetch,
    refetching,
  } = usePlanterStatusQuery(wallet, skipStats);

  const handleLogout = useCallback(
    async (userPressed: boolean) => {
      try {
        if (userPressed) {
          try {
            if (offlineTrees.planted || offlineTrees.updated) {
              const trees = [...(offlineTrees.planted || []), ...(offlineTrees.updated || [])];

              if (trees.length) {
                const isMoreThanOne = trees.length > 1;
                const treeText = isMoreThanOne ? 'trees' : 'tree';
                const treeThereText = isMoreThanOne ? 'they are' : 'it is';

                await asyncAlert(
                  t('myProfile.attention'),
                  t('myProfile.looseTree', {treesLength: trees.length, treeText, treeThereText}),
                  {text: t('myProfile.logoutAndLoose')},
                  {text: t('cancel')},
                );
              }
            }
          } catch (e) {
            return Promise.reject(e);
          }
          console.log('before removing magicToken');
          await AsyncStorage.removeItem(config.storageKeys.magicToken);
          console.log('after removing magicToken');
        }
        await AsyncStorage.clear();
        if (!userPressed) {
          if (offlineTrees.planted) {
            await AsyncStorage.setItem(offlineTreesStorageKey, offlineTrees.planted);
          }
          if (offlineTrees.updated) {
            await AsyncStorage.setItem(offlineUpdatedTreesStorageKey, offlineTrees.updated);
          }
        }
        await resetWeb3Data();
        await resetOnBoardingData();
      } catch (e) {
        console.log(e, 'e inside handleLogout');
        return Promise.reject(e);
      }
    },
    [offlineTrees.planted, offlineTrees.updated, resetOnBoardingData, resetWeb3Data, t],
  );

  useEffect(() => {
    if (statusCode && statusCode === 401 && wallet) {
      handleLogout(false).then(() => {});
    }
  }, [statusCode, handleLogout, wallet]);

  // const planterTreesCountResult = useQuery<PlanterTreesCountQueryData>(planterTreesCountQuery, {
  //   variables: {
  //     address,
  //   },
  //   skip: skipStats,
  // });

  // const planterWithdrawableBalanceResult = useQuery(planterWithdrawableBalanceQuery, {
  //   variables: {
  //     address,
  //   },
  //   fetchPolicy: 'cache-first',
  //   skip: skipStats,
  // });

  const getPlanter = useCallback(async () => {
    try {
      await planterRefetch();
    } catch (e) {
      console.log(e, 'e is hereeeeee getPlanter');
    }
  }, [planterRefetch]);

  const parseBalance = useCallback(
    (balance: string, fixed = 5) => parseFloat(web3.utils.fromWei(balance)).toFixed(fixed),
    [web3.utils],
  );

  useEffect(() => {
    if (wallet) {
      getPlanter().then(() => {});
    }
  }, [wallet, getPlanter]);

  const [submiting, setSubmitting] = useState(false);
  const handleWithdrawPlanterBalance = useCallback(async () => {
    setSubmitting(true);
    sendEvent('withdraw');
    try {
      // balance
      const balance = planterData?.balance;
      if (Number(balance) > minBalance) {
        try {
          // @here
          const transaction = await sendTransactionWithGSN(
            web3,
            wallet,
            config.contracts.PlanterFund,
            'withdrawBalance',
            [planterData?.balance.toString()],
          );

          // const transaction = await treeFactory.methods.withdrawPlanterBalance().send({from: wallet.address, gas: 1e6});
          // const transaction = await sendTransactionWithGSN(
          //   web3,
          //   wallet,
          //   config.contracts.TreeFactory,
          //   'withdrawPlanterBalance',
          // );

          console.log('transaction', transaction);
          Alert.alert(t('success'), t('myProfile.withdraw.success'));
        } catch (e) {
          Alert.alert(t('failure'), e.message || t('sthWrong'));
        }
      } else {
        Alert.alert(t('myProfile.attention'), t('myProfile.lessBalance', {amount: t('myProfile.attention')}));
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      console.warn('Error', error);
    } finally {
      setSubmitting(false);
    }
  }, [sendEvent, planterData?.balance, minBalance, web3, wallet, t]);

  const onRefetch = async () => {
    await getPlanter();
    await refetchUser();
  };

  const planterWithdrawableBalance = planterData?.balance > 0 ? parseBalance(planterData?.balance.toString()) : 0;

  const avatarStatus = isVerified ? 'active' : 'inactive';
  const avatarMarkup = loading ? (
    <ShimmerPlaceholder
      style={{
        width: 74,
        height: 74,
        borderRadius: 37,
      }}
    />
  ) : (
    <>
      <Avatar type={avatarStatus} size={74} />
      <Text style={{color: avatarStatus === 'active' ? colors.green : colors.red}}>
        {t(avatarStatus === 'active' ? 'verified' : 'notVerified')}
      </Text>
    </>
  );

  const handleOpenHelp = () => {
    sendEvent('help');
    Linking.openURL('https://discuss.treejer.com/group/planters');
  };

  const handleNavigateOfflineMap = () => {
    sendEvent('offlinemap');
    navigation.navigate('OfflineMap');
  };

  const handleSelectLanguage = () => {
    navigation.navigate('SelectLanguage', {back: true});
  };

  return (
    <ScrollView
      style={[globalStyles.screenView, globalStyles.fill]}
      refreshControl={<RefreshControl refreshing={refetching || loading} onRefresh={onRefetch} />}
    >
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.alignItemsCenter, globalStyles.safeArea]}>
        <Spacer times={8} />
        {avatarMarkup}
        <Spacer times={4} />

        {loading && (
          <View style={globalStyles.horizontalStack}>
            <ShimmerPlaceholder style={{width: 90, height: 30, borderRadius: 20}} />
            <Spacer times={4} />
            <ShimmerPlaceholder style={{width: 70, height: 30, borderRadius: 20}} />
          </View>
        )}
        {!loading && (
          <>
            {Boolean(data?.user?.firstName) && <Text style={globalStyles.h4}>{data.user.firstName}</Text>}

            {Boolean(data?.user?.firstName || loading) && <Spacer times={4} />}

            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(wallet);
                SimpleToast.show(t('myProfile.copied'), SimpleToast.LONG);
              }}
            >
              {wallet && (
                <Text numberOfLines={1} style={styles.addressBox}>
                  {wallet.slice(0, 15)}...
                </Text>
              )}
            </TouchableOpacity>
            <Spacer times={8} />

            {planterData && (
              <View style={[globalStyles.horizontalStack, styles.statsContainer]}>
                <View style={styles.statContainer}>
                  <Text style={styles.statValue}>{planterWithdrawableBalance}</Text>
                  <Text style={styles.statLabel}>{t('balance')}</Text>
                </View>

                <Spacer times={6} />

                <View style={styles.statContainer}>
                  <Text style={styles.statValue}>{planterData?.plantedCount}</Text>
                  <Text style={styles.statLabel}>{t('plantedTrees')}</Text>
                </View>

                {/*<Spacer times={6} />*/}

                {/*<View style={styles.statContainer}>*/}
                {/*  <Text style={styles.statValue}>{planterWithdrawableBalance.toFixed(5)}</Text>*/}
                {/*  <Text style={styles.statLabel}>ETH Earning</Text>*/}
                {/*</View>*/}
              </View>
            )}

            <View style={globalStyles.p3}>
              {planterWithdrawableBalance > 0 && (
                <>
                  <Button
                    style={styles.button}
                    caption={t('withdraw')}
                    variant="tertiary"
                    loading={submiting}
                    onPress={handleWithdrawPlanterBalance}
                  />
                  <Spacer times={4} />
                </>
              )}
              {status === UserStatus.Pending && (
                <>
                  <Text style={globalStyles.textCenter}>{t('pendingVerification')}</Text>
                  <Spacer times={6} />
                </>
              )}

              {/* {
            <>
              <Button
                style={styles.button}
                caption="CLEAR"
                variant="tertiary"
                onPress={() => {
                  SecureStore.deleteItemAsync(config.storageKeys.privateKey);
                }}
              />
              <Spacer times={4} />
            </>
          } */}
              {status === UserStatus.Unverified && (
                <>
                  <Button
                    style={styles.button}
                    caption={t('getVerified')}
                    variant="tertiary"
                    onPress={() => {
                      sendEvent('get_verified');
                      if (data?.user) {
                        _.navigation.navigate('VerifyProfile', {user: data.user});
                      }
                    }}
                  />
                  <Spacer times={4} />
                </>
              )}

              <Button
                style={styles.button}
                caption={t('offlineMap.title')}
                variant="tertiary"
                onPress={handleNavigateOfflineMap}
              />
              <Spacer times={4} />

              {planterData?.planterType && <Invite address={wallet} planterType={Number(planterData?.planterType)} />}

              {!wallet && (
                <>
                  <Button
                    style={styles.button}
                    caption={t('createWallet.title')}
                    variant="tertiary"
                    onPress={() => {
                      _.navigation.navigate('CreateWallet');
                    }}
                    disabled
                  />
                  <Spacer times={4} />
                </>
              )}

              <Button style={styles.button} caption={t('language')} variant="tertiary" onPress={handleSelectLanguage} />
              <Spacer times={4} />
              <Button style={styles.button} caption={t('help')} variant="tertiary" onPress={handleOpenHelp} />
              <Spacer times={4} />
              <Button
                style={styles.button}
                caption={t('logout')}
                variant="tertiary"
                onPress={() => {
                  sendEvent('logout');
                  handleLogout(true);
                }}
              />
              <Spacer times={4} />
              <AppVersion />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addressBox: {
    backgroundColor: colors.khakiDark,
    textAlign: 'center',
    borderColor: 'white',
    overflow: 'hidden',
    width: 180,
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  button: {
    width: 180,
  },
  helpWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  statContainer: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '700',
    fontSize: 20,
    color: colors.grayDarker,
    marginBottom: 5,
  },
  statLabel: {
    color: colors.grayLight,
  },
  statsContainer: {
    paddingBottom: 20,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLighter,
  },
});

export default MyProfile;
