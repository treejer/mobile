import globalStyles from 'constants/styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Image, Text, View, ScrollView, TouchableOpacity, Linking, Alert, Keyboard} from 'react-native';
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
import KeyboardDismiss from 'components/KeyboardDismiss/KeyboardDismiss';
import {useCurrentUser} from 'services/currentUser';
import {isWeb} from 'utilities/helpers/web';

interface Props {}

function NoWallet(_: Props) {
  const navigation = useNavigation();
  const {unlocked, storeMagicToken} = usePrivateKeyStorage();
  const [loading, setLoading] = useState(false);
  const [isEmail, setIsEmail] = useState<boolean>(true);

  const {refetchUser} = useCurrentUser({didMount: false});

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
    Keyboard.dismiss();
    sendEvent('connect_wallet');
    if (phoneRef.current?.isValidNumber(phoneNumber) === false) {
      phoneNumberForm.setError('phoneNumber', {
        message: t('errors.phoneNumber'),
      });
      return;
    }
    setLoading(true);
    const mobileNumber = `+${phoneRef.current.getCallingCode()}${phoneNumber}`;
    try {
      const result = await magic.auth.loginWithSMS({phoneNumber: mobileNumber});
      await storeMagicToken(result);
      await refetchUser();
      console.log(result, 'result is here');
    } catch (e) {
      Alert.alert(t('createWallet.failed.title'), e.message || 'tryAgain');
    } finally {
      setLoading(false);
    }
  });

  const handleConnectWithEmail = emailForm.handleSubmit(async ({email}) => {
    Keyboard.dismiss();
    sendEvent('connect_wallet');
    setLoading(true);
    console.log(email, 'email');
    try {
      const result = await magic.auth.loginWithMagicLink({email});
      await storeMagicToken(result);
      await refetchUser();
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
    <View style={[globalStyles.screenView, globalStyles.fill, {height: '100%'}]}>
      <ScrollView keyboardShouldPersistTaps="always" style={[{height: '100%', flex: 1}, globalStyles.screenView]}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{height: '100%', flex: 1}}
          style={{height: '100%', flex: 1}}
        >
          <KeyboardDismiss noDismiss={isWeb()} style={{height: '100%'}}>
            <View style={{height: '100%', flex: 1}}>
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
                      keyboardType="email-address"
                      onSubmitEditing={handleConnectWithEmail}
                      disabled={loading}
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
                      disabled={loading}
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
                  disabled={loading}
                />
                <Spacer times={4} />
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <SocialLoginButton name="Apple" disabled={loading} />
                  <Spacer times={2} />
                  <SocialLoginButton name="Google" color={colors.red} disabled={loading} />
                  <Spacer times={2} />
                  <SocialLoginButton name="Twitter" color="#24A4F3" disabled={loading} />
                </View>
              </View>
              <Spacer times={4} />
              <View style={{paddingHorizontal: 40, paddingVertical: 20, width: '100%'}}>
                <Card style={globalStyles.alignItemsCenter}>
                  <Text style={globalStyles.h5}>{t('createWallet.why.title')}</Text>
                  <Spacer times={5} />
                  <Text style={[globalStyles.normal, globalStyles.textCenter]}>{t('createWallet.why.details')}</Text>
                  <TouchableOpacity onPress={handleLearnMore} disabled={loading}>
                    <Text style={[globalStyles.normal, globalStyles.textCenter]}>
                      {t('createWallet.why.learnMore')}
                    </Text>
                  </TouchableOpacity>
                </Card>
              </View>
            </View>
          </KeyboardDismiss>
        </KeyboardAwareScrollView>
      </ScrollView>
    </View>
  );
}

export default NoWallet;
