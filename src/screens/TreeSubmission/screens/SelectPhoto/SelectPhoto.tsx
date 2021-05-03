import globalStyles from 'constants/styles';

import {NavigationProp, RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import * as ImagePicker from 'expo-image-picker';
import React, {useCallback, useEffect} from 'react';
import {Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import TreeSubmissionStepper from 'screens/TreeSubmission/components/TreeSubmissionStepper';
import {TreeSubmissionRouteParamList} from 'types';

interface Props {}

function SelectPhoto(_: Props) {
  const navigation = useNavigation<NavigationProp<TreeSubmissionRouteParamList>>();
  const {
    params: {journey},
  } = useRoute<RouteProp<TreeSubmissionRouteParamList, 'SelectOnMap'>>();
  const isUpdate = typeof journey?.treeIdToUpdate !== 'undefined';

  const handleSelectPhoto = useCallback(async () => {
    const {granted: grantedCamera} = await ImagePicker.requestCameraPermissionsAsync();
    const {granted: grantedCameraRoll} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (grantedCameraRoll && grantedCamera) {
      const result = await ImagePicker.launchCameraAsync({
        exif: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.cancelled === false) {
        const newJourney = {
          ...(journey ?? {}),
          photo: result,
        };

        navigation.navigate(journey?.treeIdToUpdate ? 'SubmitTree' : 'SelectOnMap', {
          journey: newJourney,
        });
      }
    } else {
      Alert.alert('Permissions required', 'Camera permission is required');
    }
  }, [navigation, journey]);

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, {paddingHorizontal: 30}]}>
        <Spacer times={10} />

        <TreeSubmissionStepper isUpdate={isUpdate} currentStep={1}>
          <Spacer times={4} />
          <Button variant="secondary" onPress={handleSelectPhoto} caption="Open Camera" />
        </TreeSubmissionStepper>
      </View>
    </ScrollView>
  );
}

export default SelectPhoto;
