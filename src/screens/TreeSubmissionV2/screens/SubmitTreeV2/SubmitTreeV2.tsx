import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {CommonActions, useNavigation} from '@react-navigation/native';

import {Routes} from 'navigation/Navigation';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import usePlanterStatusQuery from 'utilities/hooks/usePlanterStatusQuery';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import {Hex2Dec} from 'utilities/helpers/hex';
import {DraftJourneyModal} from 'screens/TreeSubmissionV2/components/DraftJourneyModal/DraftJourneyModal';
import {SubmissionButtons} from 'screens/TreeSubmissionV2/components/SubmissionButtons/SubmissionButtons';
import {CheckPermissionsV2} from 'screens/TreeSubmissionV2/components/CheckPermissions/CheckPermissionsV2';
import {SelectTreeLocation} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreeLocation';
import {PreviewTreeDetails} from 'screens/TreeSubmissionV2/components/PreviewTreeDetails/PreviewTreeDetails';
import {ChangeSettingsAlert} from 'screens/TreeSubmissionV2/components/ChangeSettingsAlert/ChangeSettingsAlert';
import {SelectTreePhoto, TOnSelectTree} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreePhoto';
import {DraftType, useDraftedJourneys} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {useCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {useNetInfo} from 'ranger-redux/modules/netInfo/netInfo';
import {useWalletAccount} from 'ranger-redux/modules/web3/web3';
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

  const walletAddress = useWalletAccount();
  const {canPlant} = usePlanterStatusQuery(walletAddress);

  const [draftState, setDraftState] = useState<TDraftState | null>(null);
  const [openSettingsAlert, setOpenSettingsAlert] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const {journey, dispatchSelectTreePhoto, dispatchClearJourney, dispatchSubmitJourney} = useCurrentJourney();
  const {dispatchDraftJourney, dispatchSaveDraftedJourney, dispatchRemoveDraftedJourney} = useDraftedJourneys();

  const {sendEvent} = useAnalytics();

  const {isConnected} = useNetInfo();

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

  const handleOpenDraftModal = useCallback(
    (draftType: DraftType) => {
      if (journey?.draftId) {
        dispatchSaveDraftedJourney({journey, draftType});
      } else {
        setDraftState({
          id: new Date(),
          draftType,
        });
      }
    },
    [journey, dispatchSaveDraftedJourney],
  );

  const handleSubmitJourney = useCallback(() => {
    if (isConnected) {
      sendEvent(journey.isUpdate ? 'update_tree_confirm' : 'add_tree_confirm');
      setShowPreview(false);
      dispatchSubmitJourney();
    } else {
      handleOpenDraftModal(DraftType.Offline);
    }
  }, [isConnected, handleOpenDraftModal, dispatchSubmitJourney, sendEvent]);

  const handleClearJourney = useCallback(
    (resetStack?: boolean) => {
      dispatchClearJourney();
      setOpenSettingsAlert(false);
      if (journey?.draftId) {
        dispatchRemoveDraftedJourney({id: journey?.draftId});
      }
      if (resetStack) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: Routes.TreeSubmission_V2}],
          }),
        );
      }
    },
    [dispatchClearJourney, navigation, dispatchRemoveDraftedJourney, journey?.draftId],
  );

  const handleDraft = useCallback(
    (name: string) => {
      if (journey && draftState) {
        dispatchDraftJourney({journey, draftType: draftState.draftType, name, id: draftState.id.toString()});
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

  if (canPlant === false && !journey.isUpdate) {
    return (
      <View testID="cant-plant-view" style={styles.cantPlantContainer}>
        <Text style={styles.cantPlantTitle}>{t('submitTreeV2.cantPlant.supplyCapReached')}</Text>
        <Spacer times={4} />
        <Text style={styles.cantPlantDesc}>{t('submitTreeV2.cantPlant.contactSupport')}</Text>
      </View>
    );
  }

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
      <RenderIf condition={openSettingsAlert}>
        <ChangeSettingsAlert
          testID="change-settings-alert-cpt"
          onReject={() => setOpenSettingsAlert(false)}
          onApprove={() => handleClearJourney(true)}
          isDrafted={!!journey?.draftId}
        />
      </RenderIf>
      <PreviewTreeDetails
        testID="preview-treeDetails-cpt"
        isVisible={showPreview}
        currentJourney={journey}
        onSubmit={handleSubmitJourney}
        onDraft={() => handleOpenDraftModal(DraftType.Draft)}
        onClose={() => setShowPreview(false)}
      />
      <SafeAreaView style={[globalStyles.screenView, globalStyles.safeArea, globalStyles.fill]}>
        <ScrollView style={[globalStyles.screenView, globalStyles.fill]} showsVerticalScrollIndicator={false}>
          <View style={[globalStyles.p1, globalStyles.pt1]}>
            <CheckPermissionsV2
              testID="check-permissions-box"
              lockSettings={canSubmit}
              onUnLock={() => setOpenSettingsAlert(true)}
              plantTreePermissions={plantTreePermissions}
            />
            <Spacer times={6} />
            <Text testID="submission-title" style={styles.title}>
              {t(`submitTreeV2.titles.${submissionTitle}`, {treeId: Hex2Dec(journey?.treeIdToUpdate!)})}
            </Text>
            <Spacer times={4} />
            {plantTreePermissions?.isCameraGranted ? (
              <SelectTreePhoto
                testID="select-tree-photo-cpt"
                treePhoto={journey?.photo}
                onSelect={handleSelectPhoto}
                disabled={!!journey.submitLoading}
              />
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
                  disabled={!!journey.submitLoading}
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
            {journey.submitLoading ? (
              <View style={[globalStyles.justifyContentCenter, globalStyles.alignItemsCenter]}>
                <ActivityIndicator
                  testID="submit-journey-loading"
                  style={styles.loader}
                  size="large"
                  color={colors.green}
                />
                <Spacer times={8} />
              </View>
            ) : (
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
                onPreview={() => setShowPreview(true)}
              />
            )}
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
  cantPlantContainer: {
    backgroundColor: colors.khaki,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    ...globalStyles.p1,
  },
  cantPlantTitle: {
    fontSize: 22,
    textAlign: 'center',
    color: colors.green,
    fontWeight: '500',
  },
  cantPlantDesc: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.grayLight,
  },
  loader: {
    transform: [{scale: 2}],
  },
});
