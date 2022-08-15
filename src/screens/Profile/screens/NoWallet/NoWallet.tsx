import globalStyles from 'constants/styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, Keyboard, Linking, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Button from 'components/Button';
import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {useConfig, useMagic, usePrivateKeyStorage} from 'services/web3';
import {locationPermission} from 'utilities/helpers/permissions';
import {useTranslation} from 'react-i18next';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import TextField, {PhoneField} from 'components/TextField';
import {useForm} from 'react-hook-form';
import PhoneInput from 'react-native-phone-number-input';
import {SocialLoginButton} from 'screens/Profile/screens/NoWallet/SocialLoginButton';
import {colors} from 'constants/values';
import KeyboardDismiss from 'components/KeyboardDismiss/KeyboardDismiss';
import {useCurrentUser} from 'services/currentUser';
import {isWeb} from 'utilities/helpers/web';
import {RootNavigationProp, Routes} from 'navigation';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {SafeAreaView} from 'react-native-safe-area-context';
import {validateEmail} from 'utilities/helpers/validators';
import AppVersion from 'components/AppVersion';
import {NoWalletImage} from '../../../../../assets/images';

export type NoWalletProps = RootNavigationProp<Routes.Login>;

function NoWallet(props: NoWalletProps) {
  const {navigation} = props;

  const {storeMagicToken} = usePrivateKeyStorage();
  const [loading, setLoading] = useState(false);
  const [isEmail, setIsEmail] = useState<boolean>(true);

  const config = useConfig();
  const magic = useMagic();

  const {refetchUser} = useCurrentUser();

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

  useEffect(() => {
    (async () => {
      if (!isWeb()) {
        await locationPermission();
      }
    })();
  }, []);

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
    setLoading(true);
    const mobileNumber = `+${phoneRef.current?.getCallingCode()}${phoneNumber}`;
    try {
      const result = await magic?.auth.loginWithSMS({phoneNumber: mobileNumber});
      console.log(result, 'result is here');
      if (result) {
        try {
          await storeMagicToken(result, {mobile: mobileNumber, country: phoneRef.current?.getCountryCode()});
        } catch (e) {
          throw e;
        }
        await refetchUser();
        console.log(result, 'result is here');
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
      setLoading(false);
    }
  });

  const handleConnectWithEmail = emailForm.handleSubmit(async ({email}) => {
    if (!validateEmail(email)) {
      emailForm.setError('email', {type: 'manual', message: t('invalidEmail')});
      return;
    }
    Keyboard.dismiss();
    sendEvent('connect_wallet');
    setLoading(true);
    console.log(email, 'email');
    try {
      const result = await magic?.auth.loginWithMagicLink({email});
      if (result) {
        await storeMagicToken(result, {email});
        await refetchUser();
        console.log(result, 'result is here');
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
      setLoading(false);
    }
  });

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
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <SocialLoginButton name="Apple" disabled={loading} />
                    <Spacer times={2} />
                    <SocialLoginButton name="Google" color={colors.red} disabled={loading} />
                    <Spacer times={2} />
                    <SocialLoginButton name="Twitter" color="#24A4F3" disabled={loading} />
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
              </View>
            </KeyboardDismiss>
          </KeyboardAwareScrollView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default NoWallet;
