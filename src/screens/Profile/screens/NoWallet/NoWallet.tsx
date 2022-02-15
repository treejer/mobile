import globalStyles from 'constants/styles';

import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Image, Text, View, ScrollView, TouchableOpacity, Linking, Alert} from 'react-native';
import Button from 'components/Button';
import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {usePrivateKeyStorage} from 'services/web3';
import {useCamera} from 'utilities/hooks';
import {locationPermission} from 'utilities/helpers/permissions';
import {useTranslation} from 'react-i18next';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import config from 'services/config';
import TextField, {PhoneField} from 'components/TextField';
import {useForm} from 'react-hook-form';
import PhoneInput from 'react-native-phone-number-input';
import {SocialLoginButton} from 'screens/Profile/screens/NoWallet/SocialLoginButton';
import {colors} from 'constants/values';
import {magic} from 'services/Magic';

interface Props {}

function NoWallet(_: Props) {
  const navigation = useNavigation();
  const {unlocked, storeMagicToken} = usePrivateKeyStorage();
  const [loading, setLoading] = useState(false);
  const [isEmail, setIsEmail] = useState<boolean>(false);

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

  const {requestCameraPermission} = useCamera();

  const {sendEvent} = useAnalytics();

  useEffect(() => {
    (async () => {
      await requestCameraPermission();
      await locationPermission();
    })();
  }, [requestCameraPermission]);

  const handleLearnMore = () => {
    Linking.openURL(config.learnMoreLink);
  };

  const submitPhoneNumber = phoneNumberForm.handleSubmit(async ({phoneNumber}) => {
    sendEvent('connect_wallet');
    setLoading(true);
    if (phoneRef.current?.isValidNumber(phoneNumber) === false) {
      phoneNumberForm.setError('phoneNumber', {
        message: t('errors.phoneNumber'),
      });
      setLoading(false);
      return;
    }
    const mobileNumber = `+${phoneRef.current.getCallingCode()}${phoneNumber}`;
    try {
      const result = await magic.auth.loginWithSMS({phoneNumber: mobileNumber});
      await storeMagicToken(result);
      console.log(result, 'result is here');
    } catch (e) {
      Alert.alert(t('createWallet.failed.title'), e.message || 'tryAgain');
    } finally {
      setLoading(false);
    }
  });

  const handleConnectWithEmail = emailForm.handleSubmit(async ({email}) => {
    sendEvent('connect_wallet');
    setLoading(true);
    console.log(email, 'email');
    try {
      const result = await magic.auth.loginWithMagicLink({email});
      await storeMagicToken(result);
      console.log(result, 'result is here');
    } catch (e) {
      Alert.alert(t('createWallet.failed.title'), e.message || 'tryAgain');
    } finally {
      setLoading(false);
    }
  });

  const handleToggleAuthMethod = () => {
    setIsEmail(!isEmail);
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
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea]}>
        <Spacer times={8} />
        <Image
          source={require('../../../../../assets/images/no-wallet.png')}
          resizeMode="contain"
          style={{width: 280, height: 180, alignSelf: 'center'}}
        />
        <Text style={[globalStyles.h4, globalStyles.textCenter]}>{t('createWallet.connectToMagic')}</Text>
        <Spacer times={4} />

        <View style={{marginHorizontal: 56, borderRadius: 8, width: 304, alignSelf: 'center'}}>
          <View style={{alignItems: 'center'}}>
            {isEmail ? (
              <TextField
                name="email"
                control={emailForm.control}
                placeholder={t('email')}
                success={emailForm.formState?.dirtyFields?.email && !emailForm.formState?.errors?.email}
                rules={{required: true}}
                style={{width: '100%'}}
                onSubmitEditing={handleConnectWithEmail}
              />
            ) : (
              <PhoneField
                control={phoneNumberForm.control}
                name="phoneNumber"
                error={phoneNumberForm.formState.isDirty && phoneNumberForm.formState.errors.phoneNumber}
                ref={phoneRef}
                textInputStyle={{height: 64, paddingLeft: 0}}
                defaultCode="CA"
                placeholder="Phone #"
                containerStyle={{width: '100%'}}
              />
            )}
          </View>
          <Spacer times={4} />
          <View style={{alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch'}}>
            <Button
              variant="success"
              caption={t('createWallet.loginWithPhone')}
              disabled={loading}
              loading={loading}
              onPress={isEmail ? handleConnectWithEmail : submitPhoneNumber}
              style={{alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center'}}
            />
          </View>
          <Spacer times={4} />
          <Text style={{textAlign: 'center'}}>{t('createWallet.or')}</Text>
          <Spacer times={4} />
          <Button
            caption={t(isEmail ? 'phoneNumber' : 'email')}
            variant="secondary"
            style={{alignItems: 'center', justifyContent: 'center'}}
            onPress={handleToggleAuthMethod}
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
