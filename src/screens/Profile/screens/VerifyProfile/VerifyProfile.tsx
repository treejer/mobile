import globalStyles from 'constants/styles';
import {colors} from 'constants/values';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import PhoneInput from 'react-native-phone-number-input';
import {PhoneNumberUtil} from 'google-libphonenumber';

import {Routes, UnVerifiedUserNavigationProp} from 'navigation/index';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Steps from 'components/Steps';
import RadioButton from 'components/RadioButton/RadioButton';
import WebCam from 'components/WebCam/WebCam';
import TextField, {PhoneField} from 'components/TextField';
import ResendCodeButton from 'screens/Profile/screens/VerifyProfile/ResendCodeButton';
import useDeepLinkingValue from 'utilities/hooks/useDeepLinking';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import {useCamera} from 'utilities/hooks';
import {urlToBlob} from 'utilities/helpers/urlToBlob';
import {isWeb} from 'utilities/helpers/web';
import getCroppedImg from 'utilities/helpers/cropImage';
import {useProfile} from 'ranger-redux/modules/profile/profile';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {useVerification} from 'ranger-redux/modules/verification/useVerification';
import {TUserStatus} from 'webServices/profile/profile';
import SelectPhotoButton from 'screens/Profile/components/SelectPhotoButton';
import {PickImageButton} from 'screens/Profile/components/PickImageButton';

interface Props extends UnVerifiedUserNavigationProp<Routes.VerifyProfile> {}

const radioItems = [
  {
    key: '2',
    text: 'Yes',
  },
  {
    key: '1',
    text: 'No',
  },
];

function VerifyProfile(props: Props) {
  const {navigation, route} = props;

  const {params} = route;
  const {journey} = params || {};

  const {openCameraHook, openLibraryHook} = useCamera();

  const {
    dispatchVerifyProfile,
    verifyProfileState,
    dispatchVerifyMobile,
    verifyMobileState,
    dispatchPhoneSendCode,
    mobileSendCodeState,
    dispatchPhoneResendCode,
    mobileResendCodeState,
  } = useVerification();

  const [idCardImageUri, setIdCardImageUri] = useState<string | any>('');
  const phoneRef = useRef<PhoneInput>(null);

  const {profile} = useProfile();

  const [requestedMobileVerification, setRequestedMobileVerification] = useState(!!profile?.mobile);
  const [phoneNumber, setPhoneNumber] = useState(profile?.mobile || '');

  const [organizationKey, setOrganizationKey] = useState<string>(radioItems[1].key);
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);

  const {t} = useTranslation();

  const {sendEvent} = useAnalytics();

  const refer = useDeepLinkingValue();
  const {referrer, organization, hasRefer} = refer;

  const handleChangeRadioButton = (key: string) => {
    setOrganizationKey(key);
  };

  const parsedPhoneNumber = useMemo(() => {
    if (profile?.mobile && profile?.mobileCountry) {
      return PhoneNumberUtil.getInstance()
        .parse(profile.mobile, profile.mobileCountry)
        ?.getNationalNumber()
        ?.toString();
    }

    return '';
  }, [profile]);

  const phoneNumberForm = useForm<{
    phoneNumber: string;
    verificationCode: string;
  }>({
    mode: 'onChange',
    defaultValues: {
      phoneNumber: parsedPhoneNumber,
    },
  });

  const nameForm = useForm<{firstName: string}>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
    },
  });

  const lastNameForm = useForm<{lastName: string}>({
    mode: 'onChange',
    defaultValues: {
      lastName: '',
    },
  });

  useEffect(() => {
    if (verifyMobileState.error) {
      phoneNumberForm.setError('verificationCode', {
        message: verifyMobileState.error || t('unknownError'),
      });
    }
    if (mobileResendCodeState.error) {
      phoneNumberForm.setError('verificationCode', {
        message: mobileResendCodeState.error || t('unknownError'),
      });
    }
    if (mobileSendCodeState.error) {
      phoneNumberForm.setError('phoneNumber', {
        message: mobileSendCodeState.error || t('unknownError'),
      });
    }
    if (verifyProfileState.error) {
      phoneNumberForm.setError('verificationCode', {
        message: verifyProfileState.error || t('unknownError'),
      });
    }
  }, [
    verifyMobileState.error,
    verifyProfileState.error,
    mobileSendCodeState.error,
    mobileResendCodeState.error,
    phoneNumberForm,
  ]);

  const currentStep = (() => {
    if (!profile?.mobileVerifiedAt) {
      return 2;
    }

    if (
      !journey?.location &&
      nameForm.formState?.dirtyFields?.firstName &&
      lastNameForm.formState.dirtyFields.lastName
    ) {
      return 4;
    }

    if (journey && journey.location && idCardImageUri) {
      return 6;
    }

    if (journey && journey?.location?.latitude) {
      return 5;
    }

    return 3;
  })();

  const submitPhoneNumber = phoneNumberForm.handleSubmit(async ({phoneNumber}) => {
    if (phoneRef.current?.isValidNumber(phoneNumber) === false) {
      phoneNumberForm.setError('phoneNumber', {
        message: t('errors.phoneNumber'),
      });
      return;
    }

    const mobileNumber = `+${phoneRef.current?.getCallingCode()}${phoneNumber}`;
    dispatchPhoneSendCode({
      mobileNumber,
      country: `${phoneRef.current?.getCountryCode()}`,
    });
    setPhoneNumber(mobileNumber);
    setRequestedMobileVerification(true);
  });

  const resendCode = async () => {
    dispatchPhoneResendCode();
    phoneNumberForm.clearErrors('verificationCode');
  };

  // const handleMutationAlert = (error: any) => {
  //   const message = restApiError(error).message || t('unknownError');
  //   showAlert({
  //     title: t('error'),
  //     message,
  //     mode: AlertMode.Error,
  //   });
  // };

  const verifyPhone = phoneNumberForm.handleSubmit(async ({verificationCode}) => {
    dispatchVerifyMobile({verifyMobileCode: verificationCode});
  });

  const submitApply = nameForm.handleSubmit(async data => {
    sendEvent('get_verified_submit');
    const input = {
      firstName: data.firstName,
      lastName: lastNameForm.getValues().lastName,
      file: idCardImageUri,
      type: Number(organizationKey),
      organizationAddress: organization || '',
      referrer: referrer || '',
      longitude: journey?.location?.longitude,
      latitude: journey?.location?.latitude,
    };

    const formData = new FormData();
    formData.append('firstName', input.firstName);
    formData.append('lastName', input.lastName);
    //@ts-ignore
    formData.append('type', input.type);
    formData.append('organizationAddress', input.organizationAddress);
    formData.append('referrer', input.referrer);
    //@ts-ignore
    formData.append('longitude', input.longitude);
    //@ts-ignore
    formData.append('latitude', input.latitude);
    formData.append('file', {
      //@ts-ignore
      uri: input.file.uri,
      type: input.file.file.type === 'image/jpg' ? 'image/jpeg' : input.file.file.type,
      name: input.file.file.name,
    });

    dispatchVerifyProfile(formData as any);
  });

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      // @web
      const result = await openCameraHook({
        width: 400,
        height: 300,
      });

      if (result?.path) {
        urlToBlob(result.path).then(blob => {
          // eslint-disable-next-line no-undef
          const fileOfBlob = new File([blob as Blob], 'file.jpg', {type: 'image/jpg'});
          setIdCardImageUri({file: fileOfBlob, uri: result.path});
          return blob;
        });
      }
    } else {
      setIsCameraVisible(true);
    }
  };

  const handlePickPhotoWeb = e => {
    setIdCardImageUri(e.target.files[0]);
  };

  const handleSelectPhoto = useCallback(async () => {
    const selectedPhoto = await openLibraryHook();
    if (selectedPhoto) {
      if (selectedPhoto?.path) {
        urlToBlob(selectedPhoto.path).then(blob => {
          // eslint-disable-next-line no-undef
          const fileOfBlob = new File([blob as Blob], 'file.jpg', {type: 'image/jpg'});
          setIdCardImageUri({file: fileOfBlob, uri: selectedPhoto.path});
          return blob;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openLibraryHook]);

  const handleDonePicture = async (image, croppedAreaPixels, rotation) => {
    const selectedPhoto = await getCroppedImg(image, 'file.jpg', croppedAreaPixels, rotation);
    setIdCardImageUri(selectedPhoto);
    setIsCameraVisible(false);
  };

  const handleDismissPicture = () => {
    setIsCameraVisible(false);
  };

  const submitButtonMarkup = idCardImageUri ? (
    <View style={{flexDirection: 'row'}}>
      <Button
        variant="success"
        onPress={submitApply}
        caption={t('submit')}
        disabled={verifyProfileState.loading}
        loading={verifyProfileState.loading}
      />
    </View>
  ) : null;

  if (isCameraVisible) {
    return <WebCam handleDone={handleDonePicture} handleDismiss={handleDismissPicture} aspect={4 / 3} />;
  }

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <KeyboardAwareScrollView>
        <ScreenTitle title={t('getVerified')} goBack />
        <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.alignItemsCenter]}>
          <Spacer times={4} />

          {profile?.userStatus === TUserStatus.Pending && (
            <>
              <Text style={globalStyles.textCenter}>{t('pendingVerification')}</Text>
              <Spacer times={6} />
            </>
          )}

          {profile?.userStatus === TUserStatus.NotVerified && (
            <>
              <Steps.Container currentStep={currentStep} style={{width: 300}}>
                {/* Step 1 - Add wallet */}
                <Steps.Step step={1}>
                  <View style={{alignItems: 'flex-start'}}>
                    <Text style={globalStyles.h6}>{t('addWalletAddress')}</Text>
                    <Spacer times={1} />
                    <Text style={[globalStyles.normal]}>{t('done')}</Text>
                  </View>
                </Steps.Step>

                {/* Step 2 - Add phone */}
                <Steps.Step step={2}>
                  <View style={{alignItems: 'flex-start'}}>
                    <Text style={globalStyles.h6}>
                      {t(profile?.mobile && requestedMobileVerification ? 'verifyPhone' : 'addPhone')}
                    </Text>
                    {renderAddPhone()}
                  </View>
                </Steps.Step>

                {/* Step 3 - Add Email */}
                <Steps.Step step={3}>
                  <View style={{alignItems: 'flex-start'}}>
                    <Text style={globalStyles.h6}>{t('addName')}</Text>
                    {renderAddName()}
                  </View>
                </Steps.Step>

                {/* Step 4 - Add location */}
                <Steps.Step step={4}>
                  <View style={{alignItems: 'flex-start'}}>
                    <Text style={globalStyles.h6}>{t('submitLocation')}</Text>
                    <Spacer times={1} />
                    {journey && journey.location ? (
                      <Text style={[globalStyles.normal]}>{t('done')}</Text>
                    ) : currentStep === 4 ? (
                      <Button
                        variant="secondary"
                        onPress={() => navigation.navigate(Routes.SelectOnMapVerifyProfile, {journey})}
                        caption={t('openMap')}
                      />
                    ) : (
                      <></>
                    )}
                  </View>
                </Steps.Step>

                {/* Step 5 - Upload ID card */}
                <Steps.Step step={5} lastStep={!!organization}>
                  <View style={{alignItems: 'flex-start'}}>
                    <Text style={globalStyles.h6}>{t('uploadIdCard')}</Text>
                    <Spacer times={1} />
                    {renderUploadIdCard()}
                  </View>
                </Steps.Step>

                {/* Step 6 - Join Organization */}
                {!organization ? (
                  <Steps.Step step={6} lastStep>
                    <View style={{alignItems: 'flex-start'}}>
                      <Text style={globalStyles.h6}>{t('joiningAsOrganization')}</Text>
                      <Spacer times={1} />
                      {renderRadioButton()}
                    </View>
                  </Steps.Step>
                ) : (
                  <></>
                )}
                <View>{submitButtonMarkup}</View>
                <Spacer times={4} />
              </Steps.Container>
            </>
          )}
        </View>
        {hasRefer && (
          <View
            style={{
              padding: 10,
              backgroundColor: 'white',
              borderColor: colors.gray,
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 10,
              marginHorizontal: 20,
              width: 300,
              alignSelf: 'center',
            }}
          >
            <Text>{t(referrer ? 'joiningReferrer' : 'joiningOrganization')}</Text>
            <Text style={globalStyles.tiny}>{referrer || organization}</Text>
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );

  function renderAddPhone() {
    if (currentStep !== 2) {
      return (
        <>
          <Spacer times={1} />
          <Text style={[globalStyles.normal]}>{t('verified!')}</Text>
        </>
      );
    }

    return (
      <>
        <Spacer times={2} />
        {!requestedMobileVerification && (
          <>
            <PhoneField
              control={phoneNumberForm.control}
              name="phoneNumber"
              error={phoneNumberForm.formState.errors.phoneNumber}
              ref={phoneRef}
              textInputStyle={{height: 64, paddingLeft: 0}}
              defaultCode={(profile?.mobileCountry as any) ?? 'CA'}
              placeholder="Phone #"
              onSubmitEditing={submitPhoneNumber}
            />
            <Spacer times={4} />
            <Button
              variant="success"
              onPress={submitPhoneNumber}
              caption={t('sendCode')}
              disabled={mobileSendCodeState.loading}
              loading={mobileSendCodeState.loading}
            />
          </>
        )}
        {requestedMobileVerification && (
          <>
            <TextField
              control={phoneNumberForm.control}
              placeholder="CODE"
              keyboardType="number-pad"
              error={phoneNumberForm.formState.errors.verificationCode}
              name="verificationCode"
              onSubmitEditing={verifyPhone}
            />
            <Spacer times={4} />
            <TouchableOpacity
              style={{marginVertical: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
              onPress={() => setRequestedMobileVerification(false)}
            >
              <Icon style={{marginHorizontal: 4, paddingVertical: 8}} name="square-edit-outline" size={20} />
              <Text style={{marginHorizontal: 4}}>{phoneNumber}</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', alignSelf: 'stretch', flex: 1}}>
              <View style={{flex: 0.4, alignItems: 'flex-end', paddingHorizontal: 4}}>
                <Button
                  variant="success"
                  onPress={verifyPhone}
                  caption={t('verify')}
                  disabled={verifyMobileState.loading}
                  loading={verifyMobileState.loading}
                  style={{width: 112, alignItems: 'center', justifyContent: 'center'}}
                />
              </View>
              <View style={{flex: 0.6, alignItems: 'flex-start', paddingHorizontal: 4}}>
                <ResendCodeButton resendCode={resendCode} loading={mobileResendCodeState.loading} />
              </View>
            </View>
          </>
        )}
      </>
    );
  }

  function renderAddName() {
    if (currentStep > 2) {
      return (
        <>
          <Spacer times={6} />
          <TextField
            name="firstName"
            control={nameForm.control}
            style={{width: '100%'}}
            placeholder="First name"
            success={nameForm.formState?.dirtyFields?.firstName && !nameForm.formState?.errors?.firstName}
            rules={{required: true}}
          />
          <Spacer times={6} />
          <TextField
            name="lastName"
            control={lastNameForm.control}
            style={{width: '100%'}}
            placeholder="Last name"
            success={lastNameForm.formState?.dirtyFields?.lastName && !lastNameForm.formState?.errors?.lastName}
            rules={{required: true}}
          />
        </>
      );
    }
  }

  function renderUploadIdCard() {
    return (
      currentStep === 5 && (
        <>
          <Text style={[globalStyles.normal]}>{t('physicalLicense')}</Text>
          <Spacer times={4} />
          <View style={{flexDirection: 'row'}}>
            <SelectPhotoButton onPress={pickImage} icon="camera" caption={t('openCamera')} />
            <PickImageButton
              icon="images"
              onPress={isWeb() ? handlePickPhotoWeb : () => handleSelectPhoto()}
              caption={t('openGallery')}
            />
          </View>
          <Spacer times={4} />
        </>
      )
    );
  }

  function renderRadioButton() {
    return (
      currentStep === 6 && (
        <>
          {/* <Text style={[globalStyles.normal]}>ID card, passport or driving license</Text> */}
          <Spacer times={1} />
          <RadioButton items={radioItems} onChange={handleChangeRadioButton} defaultValue="1" />
          <Spacer times={1} />
        </>
      )
    );
  }
}

export default VerifyProfile;
