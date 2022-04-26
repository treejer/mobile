import globalStyles from 'constants/styles';

import React, {useCallback, useState} from 'react';
import {CommonActions} from '@react-navigation/native';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {ScrollView, Text, View, Modal} from 'react-native';
import TreeSubmissionStepper from 'screens/TreeSubmission/components/TreeSubmissionStepper';
import {useCamera} from 'utilities/hooks';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {useOfflineTrees} from 'utilities/hooks/useOfflineTrees';
import {usePersistedPlantedTrees} from 'utilities/hooks/usePlantedTrees';
import {useWalletAccount} from 'services/web3';
import usePlanterStatusQuery from 'utilities/hooks/usePlanterStatusQuery';
import {useTranslation} from 'react-i18next';
import {TreeFilter} from 'components/TreeList/TreeList';
import {canUpdateTreeLocation, useAfterSelectPhotoHandler} from 'utilities/helpers/submitTree';
import {Routes} from 'navigation';
import {isWeb} from 'utilities/helpers/web';
import {TreeSubmissionStackScreenProps} from 'screens/TreeSubmission/TreeSubmission';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import WebCam from 'components/WebCam/WebCam';
import getCroppedImg from 'utilities/hooks/cropImage';
import {SafeAreaView} from 'react-native-safe-area-context';
import SubmitTreeOfflineWebModal from 'components/SubmitTreeOfflineWebModal/SubmitTreeOfflineWebModal';

interface Props extends TreeSubmissionStackScreenProps<Routes.SelectPhoto> {}

function SelectPhoto(props: Props) {
  const {route, navigation} = props;

  const {
    params: {journey},
  } = route;

  const isConnected = useNetInfoConnected();
  const {t} = useTranslation();

  const {dispatchAddOfflineUpdateTree} = useOfflineTrees();
  const [persistedPlantedTrees] = usePersistedPlantedTrees();

  const [photo, setPhoto] = useState<any>();
  const [showWebCam, setShowWebCam] = useState<boolean>(false);

  const handleAfterSelectPhoto = useAfterSelectPhotoHandler();

  const address = useWalletAccount();

  const {canPlant} = usePlanterStatusQuery(address);

  const {openCameraHook} = useCamera();
  const isUpdate = typeof journey?.treeIdToUpdate !== 'undefined';
  const isNursery = journey?.tree?.treeSpecsEntity?.nursery === 'true';
  // @here
  const canUpdate = canUpdateTreeLocation(journey, isNursery);
  console.log(journey?.tree?.treeSpecsEntity?.locations, 'journey?.tree?.treeSpecsEntity?.locations', isNursery);

  const handleSelectPhoto = useCallback(async () => {
    if (isWeb()) {
      setShowWebCam(true);
    } else {
      const selectedPhoto = await openCameraHook();
      console.log(selectedPhoto);
      if (selectedPhoto) {
        if (selectedPhoto.path) {
          // @here
          handleAfterSelectPhoto({
            selectedPhoto,
            journey,
            setPhoto,
            isUpdate,
            isNursery,
            canUpdate,
          });
        }
      }
    }
  }, [journey, openCameraHook, handleAfterSelectPhoto, isUpdate, isNursery, canUpdate]);

  const handleSelectPhotoWeb = useCallback(
    async (image, croppedAreaPixels, rotation) => {
      const file = await getCroppedImg(image, 'file.jpeg', croppedAreaPixels, rotation);
      setPhoto(file);
      setShowWebCam(false);

      handleAfterSelectPhoto({
        selectedPhoto: file,
        journey,
        setPhoto,
        isUpdate,
        isNursery,
        canUpdate,
      });
    },
    [canUpdate, handleAfterSelectPhoto, isNursery, isUpdate, journey],
  );

  const handleContinue = useCallback(() => {
    console.log(journey, 'journey handleContinue');
    if (isConnected) {
      navigation.navigate(Routes.SubmitTree, {
        journey: {
          ...journey,
          photo,
          nurseryContinuedUpdatingLocation: true,
        },
      });
    } else {
      const updatedTree = persistedPlantedTrees?.find(item => item.id === journey.treeIdToUpdate);
      dispatchAddOfflineUpdateTree({
        ...journey,
        photo,
        nurseryContinuedUpdatingLocation: true,
        tree: updatedTree,
      });
      showAlert({
        title: t('treeInventory.updateTitle'),
        message: t('submitWhenOnline'),
        mode: AlertMode.Info,
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: Routes.MyProfile}],
        }),
      );
      navigation.navigate(Routes.GreenBlock, {filter: TreeFilter.OfflineUpdate});
    }
  }, [dispatchAddOfflineUpdateTree, isConnected, journey, navigation, persistedPlantedTrees, photo, t]);

  const handleUpdateLocation = useCallback(() => {
    const updatedTree = persistedPlantedTrees?.find(item => item.id === journey.treeIdToUpdate);
    navigation.navigate(Routes.SelectOnMap, {
      journey: {
        ...journey,
        photo,
        ...updatedTree,
        tree: updatedTree,
      },
    });
  }, [journey, navigation, persistedPlantedTrees, photo]);

  if (canPlant === false) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30}}>
        <Text style={{textAlign: 'center', fontSize: 18}}>{t('supplyCapReached')}</Text>
      </View>
    );
  }

  if (showWebCam) {
    return (
      <Modal visible>
        <WebCam handleDone={handleSelectPhotoWeb} />
      </Modal>
    );
  }

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill]}>
      {isConnected === false ? <SubmitTreeOfflineWebModal /> : null}
      <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
        <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, {paddingHorizontal: 30}]}>
          <Spacer times={10} />
          <TreeSubmissionStepper
            isUpdate={isUpdate}
            currentStep={canUpdate && photo ? 2 : 1}
            isSingle={journey?.isSingle}
            count={journey?.nurseryCount}
            canUpdateLocation={canUpdate}
          >
            <Spacer times={4} />
            {/* @here */}
            {canUpdate && photo ? (
              <View style={{flexDirection: 'row'}}>
                <Button variant="secondary" onPress={handleUpdateLocation} caption={t('submitTree.update')} />
                <Button
                  variant="primary"
                  style={{justifyContent: 'center', marginHorizontal: 8}}
                  onPress={handleContinue}
                  caption={t('submitTree.continue')}
                />
              </View>
            ) : (
              <Button variant="secondary" onPress={handleSelectPhoto} caption={t('openCamera')} />
            )}
          </TreeSubmissionStepper>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SelectPhoto;
