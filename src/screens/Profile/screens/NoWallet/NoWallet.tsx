import globalStyles from 'constants/styles';

import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, Text, View, ScrollView, Alert} from 'react-native';
import TorusSdk from '@toruslabs/torus-direct-react-native-sdk';
import Button from 'components/Button';
import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {usePrivateKeyStorage} from 'services/web3';

interface Props {}

function NoWallet(_: Props) {
  const navigation = useNavigation();
  const {unlocked, storePrivateKey} = usePrivateKeyStorage();
  const [loading, setLoading] = useState(false);

  /*
  const handleConnectWallet = useCallback(() => {
    navigation.navigate('CreateWallet');
  }, [navigation]);
  */

  const handleTorusWallet = useCallback(async () => {
    try {
      setLoading(true);
      const loginDetails = await TorusSdk.triggerLogin({
        typeOfLogin: 'google',
        verifier: 'treejer-ranger-google-testnet-web',
        clientId: '116888410915-1j5mi6etjrqnbfch8ovuc4i50vg7kg3c.apps.googleusercontent.com',
      });

      requestAnimationFrame(() => {
        const normalizedPrivateKey = loginDetails.privateKey.replace(/^00/, '0x');
        storePrivateKey(normalizedPrivateKey)
          .then(() => {
            setLoading(false);
          })
          .catch(error => {
            console.warn('Error saving private key', error);
            setLoading(false);
          });
      });
    } catch (error) {
      Alert.alert('Failed to login', 'Failed to authenticate via Torus. Please try again later.');
      console.error(error, 'login caught');
      setLoading(false);
    }
  }, [storePrivateKey]);

  useEffect(() => {
    if (unlocked) {
      navigation.reset({
        index: 0,
        routes: [{name: 'MyProfile'}],
      });
    }
  }, [unlocked, navigation]);

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
        {/* <Button variant="secondary" caption="Connect Wallet" onPress={handleConnectWallet} /> */}
        <Button
          variant="secondary"
          caption="Connect Wallet"
          onPress={handleTorusWallet}
          loading={loading}
          disabled={loading}
        />
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
