import globalStyles from 'constants/styles';
import {colors} from 'constants/values';

import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import PhoneInput from 'react-native-phone-number-input';
import {useMutation, useQuery} from '@apollo/client';
import {PhoneNumberUtil} from 'google-libphonenumber';

import {Routes, UnVerifiedUserNavigationProp} from 'navigation';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Steps from 'components/Steps';
import RadioButton from 'components/RadioButton/RadioButton';
import {ChevronLeft} from 'components/Icons';
import WebCam from 'components/WebCam/WebCam';
import TextField, {PhoneField} from 'components/TextField';
import getMeQuery, {GetMeQueryData} from 'services/graphql/GetMeQuery.graphql';
import userApplyMutation from 'screens/Profile/screens/VerifyProfile/graphql/UserApplyMutation.graphql';
import updateMobileMutation from 'screens/Profile/screens/VerifyProfile/graphql/UpdateMobileMutation.graphql';
import sendSmsMutation from 'screens/Profile/screens/VerifyProfile/graphql/SendSMSMutation.graphql';
import verifyMobileMutation from 'screens/Profile/screens/VerifyProfile/graphql/VerifyMobileMutation.graphql';
import ResendCodeButton from 'screens/Profile/screens/VerifyProfile/ResendCodeButton';
import SelectPhotoButton from 'screens/TreeSubmission/screens/SelectPhoto/SelectPhotoButton';
import {PickImageButton} from 'screens/TreeSubmission/screens/SelectPhoto/PickImageButton';
import useRefer from 'utilities/hooks/useDeepLinking';
import {restApiError} from 'utilities/helpers/error';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import {useCamera} from 'utilities/hooks';
import {urlToBlob} from 'utilities/helpers/urlToBlob';
import {isWeb} from 'utilities/helpers/web';
import getCroppedImg from 'utilities/helpers/cropImage';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {useProfile, UserStatus} from '../../../../redux/modules/profile/profile';
import {useUserId} from '../../../../redux/modules/web3/web3';

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
  const {status} = useProfile();

  const {openCameraHook, openLibraryHook} = useCamera();
  const [verifyProfile, verifyProfileState] = useMutation(userApplyMutation);
  const [updateMobile, updateMobileState] = useMutation(updateMobileMutation);
  const [requestSMS, requestSMSState] = useMutation(sendSmsMutation);
  const [verifyMobile, verifyMobileState] = useMutation(verifyMobileMutation);

  const [idCardImageUri, setIdCardImageUri] = useState<string | any>('');
  const phoneRef = useRef<PhoneInput>(null);
  const {data} = useQuery<GetMeQueryData>(getMeQuery);
  const {user} = data || {};

  const [requestedMobileVerification, setRequestedMobileVerification] = useState(!!user?.mobile);
  const [phoneNumber, setPhoneNumber] = useState(user?.mobile || '');

  const {params} = route;
  const {journey} = params || {};

  const [organizationKey, setOrganizationKey] = useState<string>(radioItems[1].key);
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);

  const {t} = useTranslation();

  const {sendEvent} = useAnalytics();

  const refer = useRefer();
  const {referrer, organization, hasRefer} = refer;

  const handleChangeRadioButton = (key: string) => {
    setOrganizationKey(key);
  };

  const userId = useUserId();

  const parsedPhoneNumber = useMemo(() => {
    if (user?.mobile && user?.mobileCountry) {
      return PhoneNumberUtil.getInstance().parse(user.mobile, user.mobileCountry)?.getNationalNumber()?.toString();
    }

    return '';
  }, [user]);

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

  const currentStep = (() => {
    if (!user?.mobileVerifiedAt) {
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

  console.log(updateMobileState.data, 'updateMobileState.data');
  console.log(updateMobileState.error, 'updateMobileState.error');

  const submitPhoneNumber = phoneNumberForm.handleSubmit(async ({phoneNumber}) => {
    if (phoneRef.current?.isValidNumber(phoneNumber) === false) {
      phoneNumberForm.setError('phoneNumber', {
        message: t('errors.phoneNumber'),
      });
      return;
    }

    try {
      const mobileNumber = `+${phoneRef.current?.getCallingCode()}${phoneNumber}`;
      await updateMobile({
        variables: {
          input: {
            mobileNumber,
            country: `${phoneRef.current?.getCountryCode()}`,
          },
        },
        errorPolicy: 'all',
      });
      setPhoneNumber(mobileNumber);
      setRequestedMobileVerification(true);
    } catch (e) {
      phoneNumberForm.setError('phoneNumber', {
        message: restApiError(e).message || t('unknownError'),
      });
    }
  });

  const resendCode = async () => {
    try {
      await requestSMS();
      phoneNumberForm.clearErrors('verificationCode');
    } catch (e) {
      phoneNumberForm.setError('verificationCode', {
        message: restApiError(e).message || t('unknownError'),
      });
    }
  };

  const handleMutationAlert = (error: any) => {
    const message = restApiError(error).message || t('unknownError');
    showAlert({
      title: t('error'),
      message,
      mode: AlertMode.Error,
    });
  };

  const verifyPhone = phoneNumberForm.handleSubmit(async ({verificationCode}) => {
    try {
      await verifyMobile({
        variables: {
          input: {
            verificationCode,
          },
        },
        refetchQueries: [{query: getMeQuery}],
        awaitRefetchQueries: true,
        update: store => {
          const currentUser = store.readQuery<GetMeQueryData>({query: getMeQuery});
          store.writeQuery<GetMeQueryData>({
            query: getMeQuery,
            data: {
              user: currentUser?.user && {
                ...currentUser.user,
                mobileVerifiedAt: new Date().toISOString(),
              },
            },
          });
        },
      });
    } catch (e) {
      phoneNumberForm.setError('verificationCode', {
        message: restApiError(e).message || t('unknownError'),
      });
    }
  });

  const submitApply = nameForm.handleSubmit(async data => {
    try {
      sendEvent('get_verified_submit');
      const input = {
        firstName: data.firstName,
        lastName: lastNameForm.getValues().lastName,
        idCardFile: idCardImageUri,
        type: organizationKey,
        organizationAddress: organization || '',
        referrer: referrer || '',
        longitude: journey?.location?.longitude,
        latitude: journey?.location?.latitude,
      };
      console.log(input, 'input');
      await verifyProfile({
        variables: {
          input,
          userId,
        },
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: getMeQuery,
          },
        ],
      });

      navigation.navigate(Routes.VerifyPending);
    } catch (error) {
      phoneNumberForm.setError('verificationCode', {
        message: restApiError(error).message || t('unknownError'),
      });
    }
  });

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      // @web
      const result = await openCameraHook({
        width: 400,
        height: 300,
      });

      if (result?.path) {
        if (/file:\//.test(result.path)) {
          setIdCardImageUri(result.path);
        } else {
          urlToBlob(result.path).then(blob => {
            // eslint-disable-next-line no-undef
            const fileOfBlob = new File([blob as Blob], 'file.jpg', {type: 'image/jpg'});
            setIdCardImageUri(fileOfBlob);
            return blob;
          });
        }
      }
    } else {
      setIsCameraVisible(true);
    }
  };

  const handlePickPhotoWeb = e => {
    setIdCardImageUri(e.target.files[0]);
  };

  const handleSelectPhoto = useCallback(async () => {
    console.log('called');
    const selectedPhoto = await openLibraryHook();
    console.log(selectedPhoto, '<-====');
    if (selectedPhoto) {
      if (selectedPhoto?.path) {
        if (/file:\//.test(selectedPhoto.path)) {
          setIdCardImageUri(selectedPhoto.path);
        } else {
          urlToBlob(selectedPhoto.path).then(blob => {
            // eslint-disable-next-line no-undef
            const fileOfBlob = new File([blob as Blob], 'file.jpg', {type: 'image/jpg'});
            setIdCardImageUri(fileOfBlob);
            return blob;
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <View style={[globalStyles.horizontalStack, globalStyles.alignItemsCenter, globalStyles.p1]}>
          <TouchableOpacity onPress={() => navigation.navigate(Routes.MyProfile)}>
            <ChevronLeft />
          </TouchableOpacity>
        </View>
        <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.alignItemsCenter]}>
          <Text style={globalStyles.h4}>{t('getVerified')}</Text>

          <Spacer times={2} />

          {status === UserStatus.Pending && (
            <>
              <Text style={globalStyles.textCenter}>{t('pendingVerification')}</Text>
              <Spacer times={6} />
            </>
          )}

          {status === UserStatus.Unverified && (
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
                      {t(user?.mobile && requestedMobileVerification ? 'verifyPhone' : 'addPhone')}
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
              defaultCode={(user?.mobileCountry as any) ?? 'CA'}
              placeholder="Phone #"
              onSubmitEditing={submitPhoneNumber}
            />
            <Spacer times={4} />
            <Button
              variant="success"
              onPress={submitPhoneNumber}
              caption={t('sendCode')}
              disabled={updateMobileState.loading}
              loading={updateMobileState.loading}
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
                <ResendCodeButton resendCode={resendCode} loading={requestSMSState.loading} />
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
