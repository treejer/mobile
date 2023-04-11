import React, {useCallback, useMemo} from 'react';
import {ScrollView, View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {Routes} from 'navigation/Navigation';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {SubmissionButtons} from 'screens/TreeSubmissionV2/components/SubmissionButtons/SubmissionButtons';
import {CheckPermissionsV2} from 'screens/TreeSubmissionV2/components/CheckPermissions/CheckPermissionsV2';
import {SelectTreeLocation} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreeLocation';
import {SelectTreePhoto, TOnSelectTree} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreePhoto';
import {useCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {LockedSubmissionField} from 'components/LockedSubmissionField/LockedSubmissionField';
import {RenderIf} from 'components/Common/RenderIf';
import Spacer from 'components/Spacer';

export type SubmitTreeV2Props = {
  plantTreePermissions: TUsePlantTreePermissions;
};

export function SubmitTreeV2(props: SubmitTreeV2Props) {
  const {plantTreePermissions} = props;
  const {userLocation} = plantTreePermissions;

  const {journey, dispatchSelectTreePhoto} = useCurrentJourney();

  console.log(journey, 'journey is here');

  const navigation = useNavigation<any>();
  const {t} = useTranslation();

  const handleSelectPhoto = useCallback(
    (photoArgs: TOnSelectTree) => {
      if (userLocation) {
        console.log(photoArgs, 'photoArgs');
        dispatchSelectTreePhoto({...photoArgs, userLocation});
      }
    },
    [dispatchSelectTreePhoto, userLocation],
  );

  const handleNavigateToMap = useCallback(() => {
    navigation.navigate(Routes.SelectOnMap_V2);
  }, [navigation]);

  const canDraft = useMemo(
    () => !!(!!(journey.photo && journey.photoLocation) || journey.location),
    [journey.photo, journey.photoLocation, journey.location],
  );

  const canSubmit = useMemo(
    () => !!(journey.photo && journey.photoLocation && journey.location),
    [journey.photo, journey.photoLocation, journey.location],
  );

  const submissionTitle = useMemo(
    () => (journey.isUpdate ? 'update' : 'plant') + (journey.isSingle ? 'Single' : 'Nursery'),
    [],
  );

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.safeArea, globalStyles.fill]}>
      <ScrollView style={[globalStyles.screenView, globalStyles.fill]} showsVerticalScrollIndicator={false}>
        <View style={[globalStyles.p1, globalStyles.pt1]}>
          <CheckPermissionsV2
            testID="check-permissions-box"
            lockSettings={canDraft}
            plantTreePermissions={plantTreePermissions}
          />
          <Spacer times={6} />
          <Text testID="submission-title" style={styles.title}>
            {t(`submitTreeV2.titles.${submissionTitle}`)}
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
      <RenderIf condition={canDraft || plantTreePermissions.cantProceed}>
        <View style={[globalStyles.p1, globalStyles.pt1]}>
          <SubmissionButtons
            testID="submission-buttons"
            hasNoPermission={plantTreePermissions.cantProceed}
            canDraft={canDraft}
            canSubmit={canSubmit}
            isSingle={!!journey.isSingle}
            isUpdate={!!journey.isUpdate}
            onGrant={() => plantTreePermissions.openPermissionsSettings()}
            onDraft={() => console.log('on draft')}
            onSubmit={() => console.log('on submit')}
            onReview={() => console.log('on review')}
          />
        </View>
        <Spacer times={6} />
      </RenderIf>
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
