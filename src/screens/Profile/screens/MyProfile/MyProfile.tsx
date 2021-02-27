import globalStyles from 'constants/styles';
import {colors} from 'constants/values';

import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, RefreshControl, Alert, ToastAndroid} from 'react-native';
import {NetworkStatus} from 'apollo-boost';
import Clipboard from 'expo-clipboard';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@apollo/react-hooks';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useWalletAccount, useWeb3} from 'services/web3';
import ShimmerPlaceholder from 'components/ShimmerPlaceholder';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Avatar from 'components/Avatar';
import {sendTransactionWithGSN} from 'utilities/helpers/sendTransaction';
import {useCurrentUser, UserStatus} from 'services/currentUser';
import config from 'services/config';

import planterWithdrawableBalanceQuery from './graphql/PlanterWithdrawableBalanceQuery.graphql';
import planterTreesCountQuery, {PlanterTreesCountQueryData} from './graphql/PlanterTreesCountQuery.graphql';

interface Props {}

function MyProfile(_: Props) {
  const navigation = useNavigation();
  const web3 = useWeb3();
  const wallet = useWalletAccount();

  const {data, loading, status} = useCurrentUser();

  const isVerified = data?.me.isVerified;

  const address = useMemo(() => wallet?.address, [wallet]);
  const skipStats = !address || !isVerified;

  const planterTreesCountResult = useQuery<PlanterTreesCountQueryData>(planterTreesCountQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      address,
    },
    skip: skipStats,
  });

  const planterWithdrawableBalanceResult = useQuery(planterWithdrawableBalanceQuery, {
    variables: {
      address,
    },
    fetchPolicy: 'cache-first',
    skip: skipStats,
  });

  const [submiting, setSubmitting] = useState(false);
  const handleWithdrawPlanterBalance = useCallback(async () => {
    setSubmitting(true);
    try {
      // const transaction = await treeFactory.methods.withdrawPlanterBalance().send({from: wallet.address, gas: 1e6});
      const transaction = await sendTransactionWithGSN(
        web3,
        wallet,
        config.contracts.TreeFactory,
        'withdrawPlanterBalance',
      );

      console.log('transaction', transaction);
      Alert.alert('Success', 'You successfully withdrew!');
    } catch (error) {
      Alert.alert('Error', error.message);
      console.warn('Error', error);
    } finally {
      setSubmitting(false);
    }
  }, [web3, wallet]);

  const onRefetch = () => {
    planterWithdrawableBalanceResult.refetch();
  };

  const planterWithdrawableBalance =
    planterWithdrawableBalanceResult.data?.TreeFactory.balance > 0
      ? parseFloat(web3.utils.fromWei(planterWithdrawableBalanceResult.data.TreeFactory.balance))
      : 0;
  const refetching = planterWithdrawableBalanceResult.networkStatus === NetworkStatus.refetch;

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
    <Avatar type={avatarStatus} size={74} />
  );

  return (
    <ScrollView
      style={[globalStyles.screenView, globalStyles.fill]}
      refreshControl={<RefreshControl refreshing={refetching} onRefresh={onRefetch} />}
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

        {Boolean(data?.me?.name) && <Text style={globalStyles.h4}>{data.me.name}</Text>}

        {Boolean(data?.me?.name || loading) && <Spacer times={4} />}

        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(address);
            ToastAndroid.show('Copied to clipboard!', 1000);
          }}
        >
          {address && (
            <Text numberOfLines={1} style={styles.addressBox}>
              {address.slice(0, 15)}...
            </Text>
          )}
        </TouchableOpacity>
        <Spacer times={8} />

        {!skipStats && (
          <View style={[globalStyles.horizontalStack, styles.statsContainer]}>
            <View style={styles.statContainer}>
              <Text style={styles.statValue}>0.00</Text>
              <Text style={styles.statLabel}>O2 Balance</Text>
            </View>

            <Spacer times={6} />

            <View style={styles.statContainer}>
              <Text style={styles.statValue}>{planterTreesCountResult.data?.planterTreesCount?.count}</Text>
              <Text style={styles.statLabel}>Planted Trees</Text>
            </View>

            <Spacer times={6} />

            <View style={styles.statContainer}>
              <Text style={styles.statValue}>{planterWithdrawableBalance.toFixed(5)}</Text>
              <Text style={styles.statLabel}>ETH Earning</Text>
            </View>
          </View>
        )}

        <View style={globalStyles.p3}>
          {planterWithdrawableBalance > 0 && (
            <>
              <Button
                style={styles.button}
                caption="Withdraw"
                variant="tertiary"
                loading={submiting}
                onPress={() => {
                  handleWithdrawPlanterBalance();
                }}
              />
              <Spacer times={4} />
            </>
          )}
          {status === UserStatus.Pending && (
            <>
              <Text style={globalStyles.textCenter}>Pending verification</Text>
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
                caption="Get Verified"
                variant="tertiary"
                onPress={() => {
                  if (data?.me) {
                    navigation.navigate('VerifyProfile', {user: data.me});
                  }
                }}
              />
              <Spacer times={4} />
            </>
          )}
          {!address && (
            <>
              <Button
                style={styles.button}
                caption="Create Wallet"
                variant="tertiary"
                onPress={() => {
                  navigation.navigate('CreateWallet');
                }}
              />
              <Spacer times={4} />
            </>
          )}

          <Button style={styles.button} caption="Language" variant="tertiary" />
        </View>
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
