import {NavigationProp, RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import globalStyles from 'constants/styles';
import * as ImagePicker from 'expo-image-picker';
import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import TreeSubmissionStepper from 'screens/TreeSubmission/components/TreeSubmissionStepper';
import {TreeSubmissionRouteParamList} from 'screens/TreeSubmission/TreeSubmission';

interface Props {}

function SelectPhoto(_: Props) {
  const navigation = useNavigation<NavigationProp<TreeSubmissionRouteParamList>>();
  const {
    params: {journey},
  } = useRoute<RouteProp<TreeSubmissionRouteParamList, 'SelectOnMap'>>();
  const isUpdate = typeof journey?.treeIdToUpdate !== 'undefined';

  const handleSelectPhoto = useCallback(async () => {
    const status = await ImagePicker.getCameraPermissionsAsync();
    if (status.granted) {
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
    }
  }, [navigation]);

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
