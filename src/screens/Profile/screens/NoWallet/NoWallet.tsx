import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {Image, StyleSheet, Text, View, ScrollView} from 'react-native';

import Button from 'components/Button';
import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {usePrivateKeyStorage} from 'services/web3';
import globalStyles from 'constants/styles';

interface Props {}

function NoWallet(_: Props) {
  const navigation = useNavigation();
  const {unlocked} = usePrivateKeyStorage();

  const handleConnectWallet = useCallback(() => {
    navigation.navigate('CreateWallet');
  }, [navigation]);

  useEffect(() => {
    if (unlocked) {
      navigation.reset({
        index: 0,
        routes: [{name: 'MyProfile'}],
      });
    }
  }, [unlocked]);

  return (
    <ScrollView>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.alignItemsCenter, globalStyles.safeArea]}>
        <Spacer times={8} />
        <Image
          source={require('../../../../../assets/images/no-wallet.png')}
          resizeMode="contain"
          style={{width: 280, height: 180}}
        />
        <Text style={[globalStyles.h4, globalStyles.textCenter]}>Please connect {'\n'}your Ethereum wallet!</Text>

        <Spacer times={7} />
        <Button variant="secondary" caption="Connect Wallet" onPress={handleConnectWallet} />
        <Spacer times={9} />

        <View style={{paddingHorizontal: 40, paddingVertical: 20, width: '100%'}}>
          <Card style={globalStyles.alignItemsCenter}>
            <Text style={globalStyles.h5}>Why do I need that?</Text>
            <Spacer times={5} />
            <Text style={[globalStyles.normal, globalStyles.textCenter]}>
              By connecting your Ethereum wallet, you will recieve your rewards faster and safer. Learn more
            </Text>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

export default NoWallet;
