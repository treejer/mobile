import globalStyles from 'constants/styles';

import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, Text, View, ScrollView, Alert, TouchableOpacity, Linking} from 'react-native';
import TorusSdk from '@toruslabs/customauth-react-native-sdk';
import Button from 'components/Button';
import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {usePrivateKeyStorage} from 'services/web3';
import {useCamera} from 'utilities/hooks';
import {locationPermission} from 'utilities/helpers/permissions';
import {useTranslation} from 'react-i18next';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import config from 'services/config';

import Tips from 'react-native-tips';

interface Props {}

function NoWallet(_: Props) {
  const navigation = useNavigation();
  const {unlocked, storePrivateKey} = usePrivateKeyStorage();
  const [loading, setLoading] = useState(false);

  const {t} = useTranslation();

  /*
  const handleConnectWallet = useCallback(() => {
    navigation.navigate('CreateWallet');
  }, [navigation]);
  */

  const {requestCameraPermission} = useCamera();

  const {sendEvent} = useAnalytics();

  const [tipsVisible, setTipsVisible] = useState<any>();
  const waterfallTips = useMemo(
    () => new Tips.Waterfall(['home', 'notification', 'details', 'wishList', 'clipboard', 'message']),
    [],
  );

  const handleNextTips = () => {
    setTipsVisible(waterfallTips.next());
  };

  useEffect(() => {
    setTipsVisible(waterfallTips.start());
  }, []);

  useEffect(() => {
    (async () => {
      await requestCameraPermission();
      await locationPermission();
    })();
  }, [requestCameraPermission]);

  const handleTorusWallet = useCallback(async () => {
    try {
      console.log('started');
      sendEvent('connect_wallet');
      await setLoading(true);
      console.log('before trigger login');
      const loginDetails = await TorusSdk.triggerLogin({
        typeOfLogin: 'google',
        verifier: 'treejer-ranger-google-testnet-web',
        clientId: '116888410915-1j5mi6etjrqnbfch8ovuc4i50vg7kg3c.apps.googleusercontent.com',
      });
      console.log(loginDetails, 'loginDetails ????');
      requestAnimationFrame(() => {
        console.log('inside requestAnimationFrame');
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
      Alert.alert(t('createWallet.failed.title'), t('createWallet.failed.details'));
      console.error(error, 'login caught');
      setLoading(false);
    }
  }, [sendEvent, storePrivateKey, t]);

  const handleLearnMore = () => {
    Linking.openURL(config.learnMoreLink);
  };

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
        <Text style={[globalStyles.h4, globalStyles.textCenter]}>{t('createWallet.ethConnect')}</Text>

        <Spacer times={7} />
        {/* <Button variant="secondary" caption="Connect Wallet" onPress={handleConnectWallet} /> */}
        <Tips
          visible={tipsVisible === 'home'}
          delay={1}
          text="Hello Tips"
          onRequestClose={handleNextTips}
          position="top"
        >
          <Button
            variant="secondary"
            caption={t('createWallet.connect')}
            onPress={handleTorusWallet}
            loading={loading}
            disabled={loading}
          />
        </Tips>
        <Spacer times={9} />
        <View style={{paddingHorizontal: 40, paddingVertical: 20, width: '100%'}}>
          <Card style={globalStyles.alignItemsCenter}>
            <Text style={globalStyles.h5}>{t('createWallet.why.title')}</Text>
            <Spacer times={5} />
            <Text style={[globalStyles.normal, globalStyles.textCenter]}>{t('createWallet.why.details')}</Text>
            <TouchableOpacity onPress={handleLearnMore}>
              <Text style={[globalStyles.normal, globalStyles.textCenter]}>{t('createWallet.why.learnMore')}</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}

export default NoWallet;
