import React, {useMemo} from 'react';
import {StyleSheet, Text, View, ScrollView, Clipboard} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {useWeb3} from 'services/web3';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Avatar from 'components/Avatar';

interface Props {}

function MyProfile(props: Props) {
  const navigation = useNavigation();
  const web3 = useWeb3();
  const address = useMemo(() => {
    return web3.eth.accounts.wallet.length ? web3.eth.accounts.wallet[0].address : '';
  }, [web3]);

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.alignItemsCenter, globalStyles.safeArea]}>
        <Spacer times={8} />
        <Avatar type="inactive" size={74} />
        <Spacer times={4} />
        <Text style={globalStyles.h4}>Johnny Deppp</Text>
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
              navigation.navigate('VerifyProfile');
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
    width: 180,
    textAlign: 'center',
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 2,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: colors.khakiDark,
    paddingVertical: 10,
  },
});

export default MyProfile;
