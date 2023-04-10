import React, {useCallback} from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {Image} from 'react-native-image-crop-picker';

import {CheckPermissionsV2} from 'screens/TreeSubmissionV2/components/CheckPermissions/CheckPermissionsV2';
import globalStyles from 'constants/styles';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import Spacer from 'components/Spacer';
import {LockedSubmissionField} from 'components/LockedSubmissionField/LockedSubmissionField';
import {SelectTreeLocation} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreeLocation';
import {SelectTreePhoto} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreePhoto';
import {colors} from 'constants/values';
import {useCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {Routes} from 'navigation/Navigation';
import {TPoint} from 'utilities/helpers/distanceInMeters';

export type SubmitTreeV2Props = {
  plantTreePermissions: TUsePlantTreePermissions;
};

export function SubmitTreeV2(props: SubmitTreeV2Props) {
  const {plantTreePermissions} = props;
  const {userLocation} = plantTreePermissions;

  const {journey, dispatchSelectTreePhoto} = useCurrentJourney();

  console.log(journey, 'journey is here');

  const navigation = useNavigation<any>();

  const handleSelectPhoto = useCallback(
    (args: {photo: Image | File; fromGallery: boolean; photoLocation?: TPoint; imageBase64?: string}) => {
      if (userLocation) {
        console.log(args, 'args');
        dispatchSelectTreePhoto({...args, userLocation});
      }
    },
    [dispatchSelectTreePhoto, userLocation],
  );

  const handleNavigateToMap = useCallback(() => {
    navigation.navigate(Routes.SelectOnMap_V2);
  }, [navigation]);

  const {t} = useTranslation();

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.safeArea, globalStyles.fill]}>
      <ScrollView style={[globalStyles.screenView, globalStyles.fill]} showsVerticalScrollIndicator={false}>
        <View style={[globalStyles.p1, globalStyles.pt1]}>
          <CheckPermissionsV2 testID="check-permissions-box" plantTreePermissions={plantTreePermissions} />
          <Spacer times={6} />
          <Text testID="submission-title" style={styles.title}>
            {t('submitTreeV2.titles.plantSingle')}
          </Text>
          <Spacer times={4} />
          {plantTreePermissions?.isCameraGranted ? (
            <SelectTreePhoto testID="select-tree-photo-cpt" treePhoto={journey?.photo} onSelect={handleSelectPhoto} />
          ) : (
            <LockedSubmissionField testID="locked-camera-cpt" title="lockedField.camera" />
          )}
          <Spacer times={3} />
          {plantTreePermissions.isLocationGranted && plantTreePermissions.isGPSEnabled ? (
            <SelectTreeLocation
              hasLocation={{
                coords: journey?.location,
                canUpdate: !journey.isUpdate || journey.canUpdateLocation,
              }}
              testID="select-tree-location-cpt"
              onSelect={handleNavigateToMap}
            />
          ) : (
            <LockedSubmissionField testID="locked-location-cpt" title="lockedField.location" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.tooBlack,
  },
});
