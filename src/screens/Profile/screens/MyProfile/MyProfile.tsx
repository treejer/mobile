import React, {useMemo} from 'react';
import {StyleSheet, Text, View, ScrollView, Clipboard} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@apollo/react-hooks';

import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {useWeb3} from 'services/web3';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Avatar from 'components/Avatar';

import getMeQuery, {GetMeQueryData} from 'services/graphql/GetMeQuery.graphql';

interface Props {}

function MyProfile(props: Props) {
  const navigation = useNavigation();
  const web3 = useWeb3();
  const {data} = useQuery<GetMeQueryData>(getMeQuery, {
    fetchPolicy: 'cache-and-network'
  });

  const address = useMemo(() => {
    return web3.eth.accounts.wallet.length ? web3.eth.accounts.wallet[0].address : '';
  }, [web3]);

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.alignItemsCenter, globalStyles.safeArea]}>
        <Spacer times={8} />
        <Avatar type="inactive" size={74} />
        {data?.me?.name ? (
          <>
            <Spacer times={4} />
            <Text style={globalStyles.h4}>{data.me.name}</Text>
          </>
        ) : null}
        <Spacer times={4} />
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
