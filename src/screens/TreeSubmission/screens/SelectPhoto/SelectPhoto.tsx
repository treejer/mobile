import {NavigationProp, useNavigation} from '@react-navigation/native';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import globalStyles from 'constants/styles';
import * as ImagePicker from 'expo-image-picker';
import React, {useCallback, useEffect} from 'react';
import {Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import TreeSubmissionStepper from 'screens/TreeSubmission/components/TreeSubmissionStepper';
import {TreeSubmissionRouteParamList} from 'screens/TreeSubmission/TreeSubmission';

interface Props {}

function SelectPhoto(_: Props) {
  const navigation = useNavigation<NavigationProp<TreeSubmissionRouteParamList>>();

  const handleSelectPhoto = useCallback(async () => {
    const status = await ImagePicker.getCameraPermissionsAsync();
    if (status.granted) {
      const result = await ImagePicker.launchCameraAsync({
        exif: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.cancelled === false) {
        console.log('photo result ->', result);

        navigation.navigate('SelectOnMap', {
          journey: {
            photo: result,
          },
        });
      }
    }
  }, [navigation]);

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, {paddingHorizontal: 30}]}>
        <Spacer times={10} />
        <Text style={[globalStyles.h5, globalStyles.textCenter]}>Submit a new tree</Text>
        <Spacer times={10} />

        <TreeSubmissionStepper currentStep={1}>
          <Spacer times={4} />
          <Button variant="secondary" onPress={handleSelectPhoto} caption="Open Camera" />
        </TreeSubmissionStepper>
      </View>
    </ScrollView>
  );
}

export default SelectPhoto;
