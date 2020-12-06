import React, {useMemo} from 'react';
import {StyleSheet, Text, View, ScrollView, Clipboard} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@apollo/react-hooks';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {useWeb3} from 'services/web3';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Avatar from 'components/Avatar';

import getMeQuery, {GetMeQueryData} from 'services/graphql/GetMeQuery.graphql';

interface Props {}

function MyProfile(_: Props) {
  const navigation = useNavigation();
  const web3 = useWeb3();
  const {data, loading} = useQuery<GetMeQueryData>(getMeQuery, {
    fetchPolicy: 'cache-and-network',
  });

  const address = useMemo(() => {
    return web3.eth.accounts.wallet.length ? web3.eth.accounts.wallet[0].address : '';
  }, [web3]);

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
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

        {data?.me?.name && <Text style={globalStyles.h4}>{data.me.name}</Text>}

        {(data?.me?.name || loading) && <Spacer times={4} />}

        <Text
          numberOfLines={1}
          style={styles.addressBox}
          onPress={() => {
            Clipboard.setString(address);
          }}
        >
          {address.slice(0, 15)}...
        </Text>
        <Spacer times={8} />
        <View style={globalStyles.p3}>
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
          <Button caption="Change Wallet" variant="tertiary" />
          <Spacer times={4} />
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
