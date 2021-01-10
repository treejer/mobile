import globalStyles from 'constants/styles';

import React, {useMemo, useRef, useState} from 'react';
import {View, Text, Platform, Alert} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useForm} from 'react-hook-form';
import PhoneInput from 'react-native-phone-number-input';
import {useNavigation} from '@react-navigation/native';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {PhoneNumberUtil} from 'google-libphonenumber';
import * as ImagePicker from 'expo-image-picker';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Steps from 'components/Steps';
import TextField, {PhoneField} from 'components/TextField';
import getMeQuery, {GetMeQueryData} from 'services/graphql/GetMeQuery.graphql';

import userApplyMutation from './graphql/UserApplyMutation.graphql';
import updateMobileMutation from './graphql/UpdateMobileMutation.graphql';
import sendSmsMutation from './graphql/SendSMSMutation.graphql';
import verifyMobileMutation from './graphql/VerifyMobileMutation.graphql';

function VerifyProfile() {
  const [verifyProfile] = useMutation(userApplyMutation);
  const [updateMobile] = useMutation(updateMobileMutation, {
    fetchPolicy: 'no-cache',
  });
  const [requestSMS] = useMutation(sendSmsMutation);
  const [verifyMobile] = useMutation(verifyMobileMutation);
  const [submitting, setSubmitting] = useState(false);
  const [requestedMobileVerification, setRequestedMobileVerification] = useState(false);
  const [idCardImageUri, setIdCardImageUri] = useState('');
  const phoneRef = useRef<PhoneInput>();
  const {
    data: {me: user},
  } = useQuery<GetMeQueryData>(getMeQuery, {
    fetchPolicy: 'cache-and-network',
  });
  const navigation = useNavigation();

  const parsedPhoneNumber = useMemo(() => {
    if (user.mobile && user.mobileCountry) {
      return PhoneNumberUtil.getInstance().parse(user.mobile, user.mobileCountry).getNationalNumber().toString();
    }

    return '';
  }, [user]);

  const phoneNumberForm = useForm<{
    phoneNumber: string;
    token: string;
  }>({
    mode: 'onChange',
    defaultValues: {
      phoneNumber: parsedPhoneNumber,
    },
  });

  const nameForm = useForm<{fullName: string}>({
    mode: 'onChange',
    defaultValues: {
      fullName: '',
    },
  });

  const currentStep = (() => {
    if (!user.mobileVerifiedAt) {
      return 2;
    }

    if (!nameForm.formState.dirtyFields.fullName || nameForm.errors.fullName) {
      return 3;
    }

    return 4;
  })();

  const submitPhoneNumber = phoneNumberForm.handleSubmit(async ({phoneNumber}) => {
    if (phoneRef.current?.isValidNumber(phoneNumber) === false) {
      phoneNumberForm.setError('phoneNumber', {
        message: 'Invalid phone number',
      });
      return;
    }

    try {
      setSubmitting(true);
      await updateMobile({
        variables: {
          input: {
            mobile: phoneNumber,
            mobileCountry: phoneRef.current.getCountryCode(),
          },
        },
      });

      await requestSMS();

      setRequestedMobileVerification(true);
    } catch (error) {
      phoneNumberForm.setError('phoneNumber', {
        message: 'Invalid phone number',
      });
    } finally {
      setSubmitting(false);
    }
  });

  const verifyPhone = phoneNumberForm.handleSubmit(async ({token}) => {
    try {
      setSubmitting(true);
      await verifyMobile({
        variables: {
          token,
        },
        update: store => {
          const currentUser = store.readQuery<GetMeQueryData>({query: getMeQuery});

          store.writeQuery<GetMeQueryData>({
            query: getMeQuery,
            data: {
              me: currentUser?.me && {
                ...currentUser.me,
                mobileVerifiedAt: new Date().toISOString(),
              },
            },
          });
        },
      });
    } catch (error) {
      console.warn('Error', error);
      phoneNumberForm.setError('token', {
        message: 'PHONE_NUMBER_NOT_UNIQUE',
      });
    } finally {
      setSubmitting(false);
    }
  });

  const submitApply = nameForm.handleSubmit(async data => {
    try {
      setSubmitting(true);

      await verifyProfile({
        variables: {
          input: {
            name: data.fullName,
            idCard: idCardImageUri,
            type: 'planter',
          },
        },
        awaitRefetchQueries: true,
        refetchQueries: [
          {
            query: getMeQuery,
          },
        ],
      });

      navigation.goBack();
    } catch (error) {
      phoneNumberForm.setError('token', {
        message: 'INVALID_VERIFICATION_CODE',
      });
      console.warn('Error', error);
    } finally {
      setSubmitting(false);
    }
  });

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const {status} = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera permissions to make this work!');
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
    });

    if (result.cancelled === false) {
      setIdCardImageUri(result.uri);
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.alignItemsCenter, globalStyles.safeArea]}>
        <Spacer times={4} />
        <Text style={globalStyles.h4}>Get Verified</Text>
        <Spacer times={9} />

        <Steps.Container currentStep={currentStep} style={{width: 300}}>
          {/* Step 1 - Add wallet */}
          <Steps.Step step={1}>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={globalStyles.h6}>Add wallet address</Text>
              <Spacer times={1} />
              <Text style={[globalStyles.normal]}>Done!</Text>
            </View>
          </Steps.Step>

          {/* Step 2 - Add phone */}
          <Steps.Step step={2}>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={globalStyles.h6}>Add phone</Text>
              {renderAddPhone()}
            </View>
          </Steps.Step>

          {/* Step 3 - Add name */}
          <Steps.Step step={3}>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={globalStyles.h6}>Add name</Text>
              {renderAddName()}
            </View>
          </Steps.Step>

          {/* Step 4 - Upload ID card */}
          <Steps.Step step={4} lastStep>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={globalStyles.h6}>Upload ID card</Text>
              <Spacer times={1} />
              {renderUploadIdCard()}
            </View>
          </Steps.Step>
        </Steps.Container>
      </View>
    </KeyboardAwareScrollView>
  );

  function renderAddPhone() {
    if (currentStep !== 2) {
      return (
        <>
          <Spacer times={1} />
          <Text style={[globalStyles.normal]}>Verified!</Text>
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
              error={phoneNumberForm.formState.isDirty && phoneNumberForm.formState.errors.phoneNumber}
              ref={phoneRef}
              textInputStyle={{height: 24, paddingLeft: 0}}
              defaultCode={(user.mobileCountry as any) ?? 'CA'}
              placeholder="Phone #"
            />
            <Spacer times={4} />
            <Button
              variant="success"
              onPress={submitPhoneNumber}
              caption="Verify"
              disabled={submitting}
              loading={submitting}
            />
          </>
        )}
        {requestedMobileVerification && (
          <>
            <TextField
              control={phoneNumberForm.control}
              placeholder="CODE"
              keyboardType="number-pad"
              error={phoneNumberForm.formState.isDirty && phoneNumberForm.formState.errors.token}
              name="token"
            />
            <Spacer times={4} />
            <Button
              variant="success"
              onPress={verifyPhone}
              caption="Verify"
              disabled={submitting}
              loading={submitting}
            />
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
            name="fullName"
            control={nameForm.control}
            style={{width: '90%'}}
            placeholder="Full name"
            success={nameForm.formState.dirtyFields.fullName && !nameForm.formState.errors.fullName}
            rules={{required: true}}
          />
        </>
      );
    }
  }

  function renderUploadIdCard() {
    const submitButtonMarkup = idCardImageUri ? (
      <Button variant="success" onPress={submitApply} caption="Submit" disabled={submitting} loading={submitting} />
    ) : null;

    return (
      currentStep === 4 && (
        <>
          <Text style={[globalStyles.normal]}>ID card, passport or driving license</Text>
          <Spacer times={4} />
          <Button onPress={pickImage} caption="Open Camera" />
          <Spacer times={4} />
          {submitButtonMarkup}
        </>
      )
    );
  }
}

export default VerifyProfile;
