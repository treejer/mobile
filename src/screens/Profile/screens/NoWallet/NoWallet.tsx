import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {Image, Keyboard, Linking, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useForm} from 'react-hook-form';
import PhoneInput from 'react-native-phone-number-input';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {RootNavigationProp, Routes} from 'navigation/index';
import globalStyles from 'constants/styles';
import {cameraPermission, locationPermission} from 'utilities/helpers/permissions';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import {SocialLoginButton} from 'screens/Profile/screens/NoWallet/SocialLoginButton';
import {isWeb} from 'utilities/helpers/web';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {validateEmail} from 'utilities/helpers/validators';
import {oauthDeepLinkUrl} from 'utilities/hooks/useDeepLinking';
import KeyboardDismiss from 'components/KeyboardDismiss/KeyboardDismiss';
import Button from 'components/Button';
import Card from 'components/Card';
import Spacer from 'components/Spacer';
import AppVersion from 'components/AppVersion';
import TextField, {PhoneField} from 'components/TextField';
import {useProfile} from 'ranger-redux/modules/profile/profile';
import {useConfig, useMagic, useUserWeb3} from 'ranger-redux/modules/web3/web3';
import {OAuthRedirectResult} from 'services/Magic';
import {NoWalletImage} from '../../../../../assets/images';

export type NoWalletProps = RootNavigationProp<Routes.Login>;

function NoWallet(props: NoWalletProps) {
  const {navigation} = props;

  const {storeMagicToken, loading: web3Loading} = useUserWeb3();
  const {loading: profileLoading} = useProfile();
  const [isEmail, setIsEmail] = useState<boolean>(true);
  const [loginPressed, setLoginPressed] = useState(false);

  const config = useConfig();
  const magic = useMagic();

  // const {refetchUser} = useCurrentUser();

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

  const phoneRef = useRef<PhoneInput>(null);

  const {t} = useTranslation();

  const {sendEvent} = useAnalytics();

  const loading = useMemo(
    () => loginPressed || web3Loading || profileLoading,
    [loginPressed, profileLoading, web3Loading],
  );

  useEffect(() => {
    (async () => {
      if (!isWeb()) {
        await locationPermission();
        await cameraPermission();
      }
    })();
  }, []);

  // useEffect(() => {
  //   if (userId && accessToken) {
  //     (async function () {
  // fetchUserRequest({userId, accessToken});
  //     })();
  //   }
  // }, [userId, accessToken, fetchUserRequest]);

  const handleLearnMore = useCallback(async () => {
    await Linking.openURL(config.learnMoreLink);
  }, [config.learnMoreLink]);

  const submitPhoneNumber = phoneNumberForm.handleSubmit(async ({phoneNumber}) => {
    Keyboard.dismiss();
    sendEvent('connect_wallet');
    if (phoneRef.current?.isValidNumber(phoneNumber) === false) {
      phoneNumberForm.setError('phoneNumber', {
        message: t('errors.phoneNumber'),
      });
      return;
    }
    setLoginPressed(true);
    const mobileNumber = `+${phoneRef.current?.getCallingCode()}${phoneNumber}`;
    try {
      const result = await magic?.auth.loginWithSMS({phoneNumber: mobileNumber});
      if (result) {
        try {
          storeMagicToken(result, {mobile: mobileNumber, country: phoneRef.current?.getCountryCode()});
        } catch (e) {
          throw e;
        }
        // await refetchUser();
      } else {
        showAlert({
          title: t('createWallet.failed.title'),
          message: t('tryAgain'),
          mode: AlertMode.Error,
        });
      }
    } catch (e: any) {
      showAlert({
        title: t('createWallet.failed.title'),
        message: e?.message || t('tryAgain'),
        mode: AlertMode.Error,
      });
    } finally {
      setLoginPressed(false);
    }
  });

  const handleConnectWithEmail = emailForm.handleSubmit(async ({email}) => {
    if (!validateEmail(email)) {
      emailForm.setError('email', {type: 'manual', message: t('invalidEmail')});
      return;
    }
    Keyboard.dismiss();
    sendEvent('connect_wallet');
    setLoginPressed(true);
    try {
      const result = await magic?.auth.loginWithMagicLink({email});
      if (result) {
        storeMagicToken(result, {email});
        // await refetchUser();
      } else {
        showAlert({
          title: t('createWallet.failed.title'),
          message: t('tryAgain'),
          mode: AlertMode.Error,
        });
      }
    } catch (e: any) {
      showAlert({
        title: t('createWallet.failed.title'),
        message: e?.message || t('tryAgain'),
        mode: AlertMode.Error,
      });
    } finally {
      setLoginPressed(false);
    }
  });

  const handleConnectWithOauth = useCallback(
    async (provider: string) => {
      try {
        // @ts-ignore
        const result: OAuthRedirectResult = await magic.oauth.loginWithPopup({
          provider,
          redirectURI: oauthDeepLinkUrl(provider),
        });
      } catch (e: any) {
        showAlert({
          title: t('createWallet.failed.title'),
          message: e?.message || t('tryAgain'),
          mode: AlertMode.Error,
        });
      }
    },
    [magic.oauth, t],
  );

  const handleToggleAuthMethod = () => {
    setIsEmail(!isEmail);
  };

  // useEffect(() => {
  //   if (unlocked) {
  //     navigation.reset({
  //       index: 0,
  //       routes: [{name: Routes.Settings}],
  //     });
  //   }
  // }, [unlocked, navigation]);

  return (
    <SafeAreaView style={[globalStyles.screenView, {flex: 1}]}>
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
                  source={NoWalletImage}
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
                        style={{width: '100%', height: 46}}
                        keyboardType="email-address"
                        onSubmitEditing={handleConnectWithEmail}
                        disabled={loading}
                        error={emailForm.formState.errors.email}
                      />
                    ) : (
                      <PhoneField
                        control={phoneNumberForm.control}
                        name="phoneNumber"
                        error={
                          phoneNumberForm.formState.isDirty ? phoneNumberForm.formState.errors.phoneNumber : undefined
                        }
                        ref={phoneRef}
                        textInputStyle={{height: 40, paddingLeft: 0}}
                        defaultCode="CA"
                        placeholder="Phone #"
                        containerStyle={{width: '100%', height: 46}}
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
                  <Text style={{textAlign: 'center'}}>{t('createWallet.or')}</Text>
                  <Spacer times={4} />
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <SocialLoginButton
                      name="Facebook"
                      disabled={loading}
                      // onPress={() => handleConnectWithOauth('facebook')}
                    />
                    <Spacer times={4} />
                    <SocialLoginButton
                      name="Google"
                      disabled={loading}
                      // onPress={() => handleConnectWithOauth('google')}
                    />
                    <Spacer times={4} />
                    <SocialLoginButton
                      name="Discord"
                      disabled={loading}
                      // onPress={() => handleConnectWithOauth('discord')}
                    />
                  </View>
                </View>
                <Spacer times={4} />
                <View style={{width: 304, alignSelf: 'center', paddingVertical: 16, marginBottom: 22}}>
                  <Card style={[globalStyles.alignItemsCenter, {width: '100%'}]}>
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
                <AppVersion />
                <Spacer times={8} />
              </View>
            </KeyboardDismiss>
          </KeyboardAwareScrollView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default NoWallet;
