import React, {useCallback, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {Routes} from 'navigation/Navigation';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {DraftJourneyModal} from 'screens/TreeSubmissionV2/components/DraftJourneyModal/DraftJourneyModal';
import {SubmissionButtons} from 'screens/TreeSubmissionV2/components/SubmissionButtons/SubmissionButtons';
import {CheckPermissionsV2} from 'screens/TreeSubmissionV2/components/CheckPermissions/CheckPermissionsV2';
import {SelectTreeLocation} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreeLocation';
import {SelectTreePhoto, TOnSelectTree} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreePhoto';
import {DraftType, useDraftedJourneys} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {useCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {useNetInfo} from 'ranger-redux/modules/netInfo/netInfo';
import {LockedSubmissionField} from 'components/LockedSubmissionField/LockedSubmissionField';
import {RenderIf} from 'components/Common/RenderIf';
import Spacer from 'components/Spacer';

export type SubmitTreeV2Props = {
  plantTreePermissions: TUsePlantTreePermissions;
};

export type TDraftState = {
  id: Date;
  draftType: DraftType;
};

export function SubmitTreeV2(props: SubmitTreeV2Props) {
  const {plantTreePermissions} = props;
  const {userLocation} = plantTreePermissions;

  const [draftState, setDraftState] = useState<TDraftState | null>(null);

  const {journey, dispatchSelectTreePhoto, dispatchClearJourney} = useCurrentJourney();
  const {drafts, dispatchDraftJourney} = useDraftedJourneys();

  console.log(drafts, 'drafts');
  const {isConnected} = useNetInfo();

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

  const handleOpenDraftModal = useCallback((draftType: DraftType) => {
    setDraftState({
      id: new Date(),
      draftType,
    });
  }, []);

  const handleSubmitJourney = useCallback(() => {
    if (isConnected) {
      // TODO => submit journey request
      console.log('submit');
    } else {
      handleOpenDraftModal(DraftType.Offline);
    }
  }, [isConnected, handleOpenDraftModal]);

  const handleDraft = useCallback(
    (name: string) => {
      if (journey && draftState) {
        dispatchDraftJourney({journey, draftType: draftState.draftType, name, id: draftState.id});
        dispatchClearJourney();
        setDraftState(null);
      }
    },
    [dispatchDraftJourney, dispatchClearJourney, draftState],
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
    <>
      <RenderIf condition={!!draftState}>
        <DraftJourneyModal
          testID="draft-modal"
          isSingle={!!journey?.isSingle}
          draft={draftState}
          onSubmit={handleDraft}
          onCancel={() => setDraftState(null)}
        />
      </RenderIf>
      <SafeAreaView style={[globalStyles.screenView, globalStyles.safeArea, globalStyles.fill]}>
        <ScrollView style={[globalStyles.screenView, globalStyles.fill]} showsVerticalScrollIndicator={false}>
          <View style={[globalStyles.p1, globalStyles.pt1]}>
            <CheckPermissionsV2
              testID="check-permissions-box"
              lockSettings={canSubmit}
              plantTreePermissions={plantTreePermissions}
            />
            <Spacer times={6} />
            <Text testID="submission-title" style={styles.title}>
              {t(`submitTreeV2.titles.${submissionTitle}`, {treeId: journey?.treeIdToUpdate})}
            </Text>
            <Spacer times={4} />
            {plantTreePermissions?.isCameraGranted ? (
              <SelectTreePhoto testID="select-tree-photo-cpt" treePhoto={journey?.photo} onSelect={handleSelectPhoto} />
            ) : (
              <LockedSubmissionField testID="locked-camera-cpt" title="lockedField.camera" />
            )}
            <Spacer times={3} />
            {plantTreePermissions.isLocationGranted && plantTreePermissions.isGPSEnabled ? (
              <RenderIf condition={!(journey.isUpdate && journey.isSingle)}>
                <SelectTreeLocation
                  hasLocation={{
                    coords: journey?.location,
                    canUpdate: !journey.isUpdate || journey.canUpdateLocation,
                  }}
                  testID="select-tree-location-cpt"
                  onSelect={handleNavigateToMap}
                />
                <RenderIf condition={!!(journey?.treeIdToUpdate && journey?.isNursery)}>
                  <Spacer times={2} />
                  <Text
                    testID="update-location-text"
                    style={styles[journey?.canUpdateLocation ? 'greenText' : 'redText']}
                  >
                    {t(`submitTreeV2.${journey?.canUpdateLocation ? 'canUpdate' : 'cantUpdate'}`)}
                  </Text>
                </RenderIf>
              </RenderIf>
            ) : (
              <LockedSubmissionField testID="locked-location-cpt" title="lockedField.location" />
            )}
          </View>
        </ScrollView>
        <RenderIf condition={journey?.canDraft || plantTreePermissions.cantProceed}>
          <View style={[globalStyles.p1, globalStyles.pt1]}>
            <SubmissionButtons
              testID="submission-buttons"
              hasNoPermission={plantTreePermissions.cantProceed}
              canDraft={!!journey?.canDraft}
              canSubmit={canSubmit}
              isSingle={!!journey.isSingle}
              isUpdate={!!journey.isUpdate}
              onGrant={() => plantTreePermissions.openPermissionsSettings()}
              onDraft={() => handleOpenDraftModal(DraftType.Draft)}
              onSubmit={handleSubmitJourney}
              onPreview={() => console.log('on review')}
            />
          </View>
          <Spacer times={6} />
        </RenderIf>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.tooBlack,
  },
  redText: {
    color: colors.red,
    fontSize: 12,
  },
  greenText: {
    color: colors.green,
    fontSize: 12,
  },
});
