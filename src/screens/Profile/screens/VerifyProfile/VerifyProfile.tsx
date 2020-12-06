import React, {useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useForm} from 'react-hook-form';
import gql from 'graphql-tag';
import PhoneInput from 'react-native-phone-number-input';
import {useNavigation} from '@react-navigation/native';
import {PhoneNumberUtil} from 'google-libphonenumber';
import * as ImagePicker from 'expo-image-picker';

import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Steps from 'components/Steps';
import TextField, {PhoneField} from 'components/TextField';
import globalStyles from 'constants/styles';
import {useMutation, useQuery} from '@apollo/react-hooks';

import getMeQuery, {GetMeQueryData} from 'services/graphql/GetMeQuery.graphql';

const userApplyMutation = gql`
  mutation UserApply($input: any) {
    apply(input: $input)
      @rest(type: "UserApplyResponse", method: "POST", path: "/users/apply", bodySerializer: "formData") {
      message
    }
  }
`;

const updateMobileMutation = gql`
  mutation UpdateMobile($input: any) {
    updateMobile(input: $input) @rest(type: "UserUpdateMobileResponse", method: "PUT", path: "/users/updateMobile") {
      message
    }
  }
`;

const sendSmsMutation = gql`
  mutation SendSMS {
    requestSMS(input: {}) @rest(type: "UserSendSMSResponse", method: "POST", path: "/mobile/resend") {
      message
    }
  }
`;

const verifyMobileMutation = gql`
  mutation SendSMS($token: String!) {
    verifyMobile(input: {token: $token})
      @rest(type: "UserVerifyMobileResponse", method: "POST", path: "/mobile/verify") {
      message
    }
  }
`;

interface Props {}

function VerifyProfile(props: Props) {
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

  const nameForm = useForm<{
    fullName: string;
  }>({
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

  console.log('currentStep', currentStep, user);

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
      const response = await verifyMobile({
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

      console.log('mobile verify response', response);
    } catch (error) {
      console.log('error --->', error);
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

      const result = await verifyProfile({
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

      console.log('result', result);
      navigation.goBack();
    } catch (err) {
      phoneNumberForm.setError('token', {
        message: 'INVALID_VERIFICATION_CODE',
      });
      console.log('error', err);
    } finally {
      setSubmitting(false);
    }
  });

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const {status} = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
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
              {currentStep === 2 ? (
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
              ) : (
                <>
                  <Spacer times={1} />
                  <Text style={[globalStyles.normal]}>Verified!</Text>
                </>
              )}
            </View>
          </Steps.Step>

          {/* Step 3 - Add name */}
          <Steps.Step step={3}>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={globalStyles.h6}>Add name</Text>
              {currentStep > 2 && (
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
              )}
            </View>
          </Steps.Step>

          {/* Step 4 - Upload ID card */}
          <Steps.Step step={4} lastStep>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={globalStyles.h6}>Upload ID card</Text>
              <Spacer times={1} />

              {currentStep === 4 && (
                <>
                  <Text style={[globalStyles.normal]}>ID card, passport or driving license</Text>
                  <Spacer times={4} />
                  <Button onPress={pickImage} caption="Open Camera" />
                  <Spacer times={4} />
                  {idCardImageUri ? (
                    <Button
                      variant="success"
                      onPress={submitApply}
                      caption="Submit"
                      disabled={submitting}
                      loading={submitting}
                    />
                  ) : null}
                </>
              )}
            </View>
          </Steps.Step>
        </Steps.Container>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  signInText: {
    color: '#67B68C',
  },
  buttonsWrapper: {
    width: 200,
  },
});

export default VerifyProfile;
