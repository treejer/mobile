import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, RefreshControl, Alert} from 'react-native';
import Clipboard from 'expo-clipboard';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@apollo/react-hooks';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {useTreeFactory, useWalletAccount, useWeb3} from 'services/web3';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Avatar from 'components/Avatar';

import getMeQuery, {GetMeQueryData} from 'services/graphql/GetMeQuery.graphql';
import planterWithdrawableBalanceQuery from './graphql/PlanterWithdrawableBalanceQuery.graphql';
import {NetworkStatus} from 'apollo-boost';
import {sendTransaction} from 'utilities/helpers/sendTransaction';
import config from 'services/config';

interface Props {}

function MyProfile(_: Props) {
  const navigation = useNavigation();
  const web3 = useWeb3();
  const wallet = useWalletAccount();

  const treeFactory = useTreeFactory();
  const {data, loading} = useQuery<GetMeQueryData>(getMeQuery, {
    fetchPolicy: 'cache-and-network',
  });

  const address = useMemo(() => {
    return wallet?.address;
  }, [wallet]);

  // const address = '0x9ec0A4472fF40cd9beE54A26a268c29C9dF3872F';

  const planterWithdrawableBalanceResult = useQuery(planterWithdrawableBalanceQuery, {
    variables: {
      address: address,
    },
    fetchPolicy: 'cache-first',
    skip: !address,
  });

  const [submiting, setSubmitting] = useState(false);
  const handleWithdrawPlanterBalance = useCallback(async () => {
    setSubmitting(true);
    try {
      const tx = treeFactory.methods.withdrawPlanterBalance();

      const receipt = await sendTransaction(web3, tx, config.contracts.TreeFactory.address, wallet);
      console.log('receipt', receipt.transactionHash);
      Alert.alert('You successfully withdraw!');
    } catch (error) {
      Alert.alert(error.message);
      console.log('error', error);
    } finally {
      setSubmitting(false);
    }
  }, [treeFactory, web3, wallet]);

  const onRefetch = () => {
    planterWithdrawableBalanceResult.refetch();
  };

  const planterWithdrawableBalance =
    planterWithdrawableBalanceResult.data?.TreeFactory.balance > 0
      ? parseFloat(web3.utils.fromWei(planterWithdrawableBalanceResult.data?.TreeFactory.balance))
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
          <Avatar type="inactive" size={74} />
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

        <Text
          numberOfLines={1}
          style={styles.addressBox}
          onPress={() => {
            Clipboard.setString(address);
            Alert.alert("Address copied to clipboard!")
          }}
        >
          {address.slice(0, 15)}...
        </Text>
        <Spacer times={8} />

        {planterWithdrawableBalance > 0 && (
          <>
            <Text numberOfLines={1}>Withdrawable Balance : ~{planterWithdrawableBalance.toFixed(5)} ETH</Text>
            <Spacer times={4} />
          </>
        )}

        <View style={globalStyles.p3}>
          {planterWithdrawableBalance > 0 && (
            <>
              <Button
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
                caption="Create Wallet"
                variant="tertiary"
                onPress={() => {
                  navigation.navigate('CreateWallet');
                }}
              />
              <Spacer times={4} />
            </>
          )}

          <Button caption="Language" variant="tertiary" />
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
});

export default MyProfile;
