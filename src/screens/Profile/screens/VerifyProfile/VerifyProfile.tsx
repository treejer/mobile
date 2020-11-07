import {useNavigation} from '@react-navigation/native';
import React, {useRef} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useForm} from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';

import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Steps from 'components/Steps';
import TextField from 'components/TextField';
import globalStyles from 'constants/styles';

interface Props {}

function VerifyProfile(props: Props) {
  const {control, handleSubmit, errors, formState} = useForm<{
    firstName: string;
    lastName: string;
  }>({
    mode: 'onChange',
  });

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const {status} = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
      }
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      alert('got the photo');
    }
  };

  const currentStep = formState.isDirty && formState.isValid ? 3 : 2;

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

          {/* Step 2 - Add name */}
          <Steps.Step step={2}>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={globalStyles.h6}>Add name</Text>
              <Spacer times={6} />
              <TextField
                name="firstName"
                control={control}
                style={{width: '90%'}}
                placeholder="First name"
                success={formState.dirtyFields.firstName && !formState.errors.firstName}
                rules={{required: true}}
              />
              <Spacer times={4} />
              <TextField
                name="lastName"
                control={control}
                style={{width: '90%'}}
                placeholder="Last name"
                success={formState.dirtyFields.lastName && !formState.errors.lastName}
                rules={{required: true}}
              />
            </View>
          </Steps.Step>

          {/* Step 3 - Upload ID card */}
          <Steps.Step step={3} lastStep>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={globalStyles.h6}>Upload ID card</Text>
              <Spacer times={1} />

              {currentStep === 3 && (
                <>
                  <Text style={[globalStyles.normal]}>ID card, passport or driving license</Text>
                  <Spacer times={4} />
                  <Button onPress={pickImage} caption="Open Camera" />
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
