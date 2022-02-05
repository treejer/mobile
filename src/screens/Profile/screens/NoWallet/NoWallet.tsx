import globalStyles from 'constants/styles';

import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import {magic} from '../../../../../App';
import TextField, {PhoneField} from 'components/TextField';
import {useForm} from 'react-hook-form';
import PhoneInput from 'react-native-phone-number-input';
import {SocialLoginButton} from 'screens/Profile/screens/NoWallet/SocialLoginButton';
import {colors} from 'constants/values';

interface Props {}

function NoWallet(_: Props) {
  const navigation = useNavigation();
  const {unlocked, storePrivateKey} = usePrivateKeyStorage();
  const [loading, setLoading] = useState(false);

  const phoneNumberForm = useForm<{
    phoneNumber: string;
  }>({
    mode: 'onChange',
    defaultValues: {
      phoneNumber: '',
    },
  });

  const emailForm = useForm<{
    email: string;
  }>({
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const phoneRef = useRef<PhoneInput>();

  const {t} = useTranslation();

  /*
  const handleConnectWallet = useCallback(() => {
    navigation.navigate('CreateWallet');
  }, [navigation]);
  */

  const {requestCameraPermission} = useCamera();

  const {sendEvent} = useAnalytics();

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

  const handleConnectWithPhone = async () => {
    try {
      const result = await magic.auth.loginWithSMS({phoneNumber: '+19713741552'});
      // const result = WyIweDUwNjZmZDAxNjNmYmFhNzY2MTY3NWFmOWY5Y2IyZTI2M2FkZGYwZDg3ZDhlNDZkZmM0NzFiMmU4OTIxNGMyMGEzMWQ4YjQ3ZjRjZjQ3MDU1MTUxNGUwMmJmNzA5MTE3YTJhMzQ4ZTA3NzFjZDkwZTVjNDVmOTEzOThkYjQ4MjAzMWIiLCJ7XCJpYXRcIjoxNjQ0MDg2NDExLFwiZXh0XCI6MTY0NDA4NzMxMSxcImlzc1wiOlwiZGlkOmV0aHI6MHg4Q0UzZTg1NDZGYTdhOTZlRTJhNzEyZkMwNjI2RmIyODc3RDIzY2E0XCIsXCJzdWJcIjpcIlpuY3B5T3JPdGVUVE83cWdvcXdBMl94SkxrZ05rOUNSZExfbTJUNmtYQ0E9XCIsXCJhdWRcIjpcIk1tZ1ZoUGRqd2dSMVlaaDJpX2I3dWNYMjlxanA3YzRUZzZzZjIxZ0hOYzA9XCIsXCJuYmZcIjoxNjQ0MDg2NDExLFwidGlkXCI6XCJjNTI2YmJjZC0zZDA5LTRlNTEtYWVhMS00MjVkMjVlOWIzYzZcIixcImFkZFwiOlwiMHg3MzUwZGY2ZDAzYzM4MGVlYjdkNTg1OTg5NjQxMTgxOWE1Nzk1OTkxZmMxMzZhZTU3NzcwNTZlM2VmZmExODQ3MTlkZWNkZjRkOGE4NDkzZjc0NTE3MmRiMGJkNjRkMzViMjE2ZjZiMTc2MjRkZGU3NmI2MGNjYmQ5ZjEzM2I2ZTFjXCJ9Il0=
      console.log(result, 'result is here');
    } catch (e) {
      console.log(e, 'e is here');
    }
  };

  const submitPhoneNumber = phoneNumberForm.handleSubmit(async ({phoneNumber}) => {
    console.log(phoneNumber, 'phoneNumber submit');
    if (phoneRef.current?.isValidNumber(phoneNumber) === false) {
      phoneNumberForm.setError('phoneNumber', {
        message: t('errors.phoneNumber'),
      });
      return;
    }
  });

  console.log(phoneNumberForm.watch(), '<==');

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
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea]}>
        <Spacer times={8} />
        <Image
          source={require('../../../../../assets/images/no-wallet.png')}
          resizeMode="contain"
          style={{width: 280, height: 180, alignSelf: 'center'}}
        />
        <Text style={[globalStyles.h4, globalStyles.textCenter]}>{t('createWallet.connectToMagic')}</Text>
        <Spacer times={4} />

        {/*<Button caption="Auth" onPress={handleConnectWithPhone} />*/}

        <View style={{backgroundColor: 'white', padding: 16, marginHorizontal: 56, borderRadius: 8}}>
          <View style={{alignItems: 'center'}}>
            <PhoneField
              control={phoneNumberForm.control}
              name="phoneNumber"
              error={phoneNumberForm.formState.isDirty && phoneNumberForm.formState.errors.phoneNumber}
              ref={phoneRef}
              textInputStyle={{height: 64, paddingLeft: 0}}
              defaultCode="CA"
              placeholder="Phone #"
            />
          </View>
          <Spacer times={4} />
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Button variant="secondary" caption={t('createWallet.loginWithPhone')} />
          </View>
          <Spacer times={4} />
          <Text style={{textAlign: 'center'}}>{t('createWallet.or')}</Text>
          <Spacer times={4} />
          <TextField
            name="email"
            control={emailForm.control}
            placeholder="Email"
            success={emailForm.formState?.dirtyFields?.email && !emailForm.formState?.errors?.email}
            rules={{required: true}}
            style={{width: '100%'}}
          />
          <Spacer times={4} />
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <SocialLoginButton name="Apple" />
            <Spacer times={2} />
            <SocialLoginButton name="Google" color={colors.red} />
            <Spacer times={2} />
            <SocialLoginButton name="Twitter" color="#24A4F3" />
          </View>
        </View>

        <Spacer times={4} />
        {/* <Button variant="secondary" caption="Connect Wallet" onPress={handleConnectWallet} /> */}

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
