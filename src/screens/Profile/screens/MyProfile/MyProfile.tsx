import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Routes, UnVerifiedUserNavigationProp, VerifiedUserNavigationProp} from 'navigation';
import RefreshControl from 'components/RefreshControl/RefreshControl';
import ShimmerPlaceholder from 'components/ShimmerPlaceholder';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import AppVersion from 'components/AppVersion';
import PullToRefresh from 'components/PullToRefresh/PullToRefresh';
import {ProfileMagicWallet} from 'components/MagicWallet/ProfileMagicWallet';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import usePlanterStatusQuery from 'utilities/hooks/usePlanterStatusQuery';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import {isWeb} from 'utilities/helpers/web';
import useRefer from 'utilities/hooks/useDeepLinking';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {useTreeUpdateInterval} from 'utilities/hooks/useTreeUpdateInterval';
import Invite from 'screens/Profile/screens/MyProfile/Invite';
import {useSettings} from '../../../../redux/modules/settings/settings';
import {useContracts} from '../../../../redux/modules/contracts/contracts';
import {UserStatus, useProfile} from '../../../../redux/modules/profile/profile';
import {useConfig, usePlanterFund, useWalletAccount, useWalletWeb3} from '../../../../redux/modules/web3/web3';

export type MyProfileProps =
  | VerifiedUserNavigationProp<Routes.MyProfile>
  | UnVerifiedUserNavigationProp<Routes.MyProfile>;

function MyProfile(props: MyProfileProps) {
  const {navigation, route} = props;
  const {t} = useTranslation();

  const requiredBalance = useMemo(() => 500000000000000000, []);
  const [minBalance, setMinBalance] = useState<number>(requiredBalance);
  const planterFundContract = usePlanterFund();
  const config = useConfig();
  const {getBalance, loading: contractsLoading} = useContracts();
  useTreeUpdateInterval();

  // const user = useCurrentUser();
  // console.log(user, 'user>++');

  const {referrer, organization, hasRefer} = useRefer();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // @here This useEffect should be a hook or fix minBalanceQuery method
  useEffect(() => {
    getMinBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const web3 = useWalletWeb3();
  const wallet = useWalletAccount();
  const {useGSN} = useSettings();

  const {sendEvent} = useAnalytics();

  // const {data, loading, status, refetchUser, handleLogout} = useCurrentUser();
  const {profile, loading, status, dispatchProfile, handleLogout} = useProfile();
  const isVerified = profile?.isVerified;

  const isConnected = useNetInfoConnected();

  // const minBalanceQuery = useQuery<PlanterMinWithdrawableBalanceQueryQueryData>(planterMinWithdrawQuery, {
  //   variables: {},
  //   fetchPolicy: 'cache-first',
  // });

  const skipStats = !wallet || !isVerified;

  const {
    data: planterData,
    refetchPlanterStatus: planterRefetch,
    refetching,
  } = usePlanterStatusQuery(wallet, skipStats);

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

  useEffect(() => {
    // if (wallet && isConnected) {
    getPlanter().then(() => {});
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [submitting, setSubmitting] = useState(false);

  const onRefetch = () =>
    new Promise((resolve: any, reject: any) => {
      return (async () => {
        getBalance();
        await getPlanter();
        await dispatchProfile();
        resolve();
      })();
    });

  const planterWithdrawableBalance =
    Number(planterData?.balance) > 0 ? parseBalance(planterData?.balance.toString() || '0') : 0;

  const avatarStatus = isVerified ? 'active' : 'inactive';
  const profileLoading = loading || !profile;
  const avatarMarkup = profileLoading ? (
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

  const handleNavigateSupport = () => {
    sendEvent('Support');
    // return Linking.openURL('https://discuss.treejer.com/group/planters');
    // @ts-ignore
    navigation.navigate(Routes.Support);
  };

  const handleNavigateActivity = () => {
    // @ts-ignore
    navigation.navigate(Routes.Activity);
  };

  const handleNavigateOfflineMap = () => {
    sendEvent('offlinemap');
    // @ts-ignore
    navigation.navigate(Routes.OfflineMap);
  };

  const handleNavigateSettings = () => {
    // @ts-ignore
    navigation.navigate(Routes.Settings);
  };

  const handleNavigateWithdraw = () => {
    // @ts-ignore
    navigation.navigate(Routes.Withdraw);
  };

  return (
    <SafeAreaView style={[{flex: 1}, globalStyles.screenView]}>
      <PullToRefresh onRefresh={onRefetch}>
        <ScrollView
          style={[globalStyles.screenView, globalStyles.fill]}
          refreshControl={
            isWeb() ? undefined : (
              <RefreshControl refreshing={profileLoading || refetching || contractsLoading} onRefresh={onRefetch} />
            )
          }
        >
          <View style={[globalStyles.screenView, globalStyles.alignItemsCenter]}>
            <Spacer times={8} />
            {avatarMarkup}
            <Spacer times={4} />

            {profileLoading ? (
              <View style={globalStyles.horizontalStack}>
                <ShimmerPlaceholder style={{width: 90, height: 30, borderRadius: 20}} />
                <Spacer times={4} />
                <ShimmerPlaceholder style={{width: 70, height: 30, borderRadius: 20}} />
              </View>
            ) : null}
            {!profileLoading && (
              <>
                {profile?.firstName ? <Text style={globalStyles.h4}>{profile.firstName}</Text> : null}

                {profile?.firstName ? <Spacer times={4} /> : null}
                <Spacer times={4} />

                {planterData && (
                  <Card style={[globalStyles.horizontalStack, styles.statsContainer]}>
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
                  </Card>
                )}
                <Spacer times={4} />

                {wallet ? <ProfileMagicWallet wallet={wallet} /> : null}
                <Spacer times={5} />

                <View style={[globalStyles.alignItemsCenter, {padding: 16}]}>
                  {profile.isVerified ? (
                    <>
                      <Button
                        style={styles.button}
                        caption={t('withdraw')}
                        variant="tertiary"
                        onPress={handleNavigateWithdraw}
                      />
                      <Spacer times={4} />
                    </>
                  ) : null}
                  {(status === UserStatus.Pending || Boolean(route.params?.hideVerification)) && (
                    <>
                      <Text style={globalStyles.textCenter}>{t('pendingVerification')}</Text>
                      <Spacer times={6} />
                    </>
                  )}

                  {!route.params?.hideVerification && status === UserStatus.Unverified && !hasRefer && (
                    <>
                      <Button
                        style={styles.button}
                        caption={t('getVerified')}
                        variant="tertiary"
                        onPress={() => {
                          sendEvent('get_verified');
                          if (profile) {
                            // @ts-ignore
                            navigation.navigate(Routes.VerifyProfile);
                          }
                        }}
                      />
                      <Spacer times={4} />
                    </>
                  )}

                  {!route.params?.hideVerification && status === UserStatus.Unverified && hasRefer && (
                    <>
                      <TouchableOpacity
                        style={styles.getVerifiedRefer}
                        onPress={() => {
                          sendEvent('get_verified');
                          if (profile) {
                            // @ts-ignore
                            navigation.navigate(Routes.VerifyProfile);
                          }
                        }}
                      >
                        <Spacer times={2} />
                        <Text>{t(referrer ? 'joiningReferrer' : 'joiningOrganization')}</Text>
                        <Text style={globalStyles.tiny}>{referrer || organization}</Text>
                        <Spacer times={4} />
                        <Text
                          style={[
                            globalStyles.h5,
                            {
                              color: colors.green,
                              fontWeight: 'bold',
                            },
                          ]}
                        >
                          {t(referrer ? 'getVerified' : 'joinAndGetVerified')}
                        </Text>
                        <Spacer times={2} />
                      </TouchableOpacity>
                      <Spacer times={10} />
                    </>
                  )}

                  {!route.params?.unVerified && !isWeb() ? (
                    <>
                      <Button
                        style={styles.button}
                        caption={t('offlineMap.title')}
                        variant="tertiary"
                        onPress={handleNavigateOfflineMap}
                      />
                      <Spacer times={4} />
                    </>
                  ) : null}

                  {planterData?.planterType && !!wallet ? (
                    <Invite style={styles.button} address={wallet} planterType={Number(planterData?.planterType)} />
                  ) : null}

                  <Button
                    style={styles.button}
                    caption={t('settings.title')}
                    variant="tertiary"
                    onPress={handleNavigateSettings}
                  />
                  <Spacer times={4} />
                  <Button
                    style={styles.button}
                    caption={t('support')}
                    variant="tertiary"
                    onPress={handleNavigateSupport}
                  />
                  {profile.isVerified ? (
                    <>
                      <Spacer times={4} />
                      <Button
                        style={styles.button}
                        caption={t('activity')}
                        variant="tertiary"
                        onPress={handleNavigateActivity}
                      />
                    </>
                  ) : null}
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
          <Spacer times={4} />
        </ScrollView>
      </PullToRefresh>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    maxWidth: 300,
    justifyContent: 'center',
  },
  getVerifiedRefer: {
    width: 280,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowOffset: {
      width: 2,
      height: 6,
    },
    shadowRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    elevation: 6,
    alignItems: 'center',
  },
});

export default MyProfile;
