import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, RefreshControl, Alert, ToastAndroid} from 'react-native';
import {NetworkStatus} from 'apollo-boost';
import Clipboard from 'expo-clipboard';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@apollo/react-hooks';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import {TouchableOpacity} from 'react-native-gesture-handler';

import getMeQuery, {GetMeQueryData} from 'services/graphql/GetMeQuery.graphql';
import {sendTransaction} from 'utilities/helpers/sendTransaction';
import config from 'services/config';

import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {useTreeFactory, useWalletAccount, useWeb3} from 'services/web3';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Avatar from 'components/Avatar';

import planterWithdrawableBalanceQuery from './graphql/PlanterWithdrawableBalanceQuery.graphql';
import planterTreesCountQuery, {PlanterTreesCountQueryData} from './graphql/PlanterTreesCountQuery.graphql';

interface Props {}

function MyProfile(_: Props) {
  const navigation = useNavigation();
  const web3 = useWeb3();
  const wallet = useWalletAccount();

  const treeFactory = useTreeFactory();
  const {data, loading} = useQuery<GetMeQueryData>(getMeQuery, {
    fetchPolicy: 'cache-and-network',
  });

  const isVerified = data?.me.isVerified;

  const address = useMemo(() => wallet?.address, [wallet]);
  const skipStats = !address || !isVerified;

  const planterTreesCountResult = useQuery<PlanterTreesCountQueryData>(planterTreesCountQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      address: address,
    },
    skip: skipStats,
  });

  const planterWithdrawableBalanceResult = useQuery(planterWithdrawableBalanceQuery, {
    variables: {
      address: address,
    },
    fetchPolicy: 'cache-first',
    skip: skipStats,
  });

  const [submiting, setSubmitting] = useState(false);
  const handleWithdrawPlanterBalance = useCallback(async () => {
    setSubmitting(true);
    try {
      const tx = treeFactory.methods.withdrawPlanterBalance();

      const receipt = await sendTransaction(web3, tx, config.contracts.TreeFactory.address, wallet);
      console.log('Receipt', receipt.transactionHash);
      Alert.alert('Success', 'You successfully withdrew!');
    } catch (error) {
      Alert.alert('Error', error.message);
      console.warn('Error', error);
    } finally {
      setSubmitting(false);
    }
  }, [treeFactory, web3, wallet]);

  const onRefetch = () => {
    planterWithdrawableBalanceResult.refetch();
  };

  const planterWithdrawableBalance =
    planterWithdrawableBalanceResult.data?.TreeFactory.balance > 0
      ? parseFloat(web3.utils.fromWei(planterWithdrawableBalanceResult.data.TreeFactory.balance))
      : 0;
  const refetching = planterWithdrawableBalanceResult.networkStatus === NetworkStatus.refetch;

  return (
    <ScrollView
      style={[globalStyles.screenView, globalStyles.fill]}
      refreshControl={<RefreshControl refreshing={refetching} onRefresh={onRefetch} />}
    >
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.alignItemsCenter, globalStyles.safeArea]}>
        <Spacer times={8} />
        {loading ? (
          <ShimmerPlaceholder
            style={{
              width: 74,
              height: 74,
              borderRadius: 37,
            }}
          />
        ) : (
          <Avatar type={isVerified ? 'active' : 'inactive'} size={74} />
        )}
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

          {data?.me && !data?.me?.isVerified && (
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
