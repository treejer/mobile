import globalStyles from 'constants/styles';

import React, {useCallback, useEffect, useState} from 'react';
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
import {TreeFilter} from 'components/TreeList/TreeFilterItem';
import {canUpdateTreeLocation, useAfterSelectPhotoHandler} from 'utilities/helpers/submitTree';
import {Routes} from 'navigation';
import {isWeb} from 'utilities/helpers/web';
import {TreeSubmissionStackScreenProps} from 'screens/TreeSubmission/TreeSubmission';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import WebCam from 'components/WebCam/WebCam';
import getCroppedImg from 'utilities/hooks/cropImage';
import {SafeAreaView} from 'react-native-safe-area-context';
import SubmitTreeOfflineWebModal from 'components/SubmitTreeOfflineWebModal/SubmitTreeOfflineWebModal';
import {useCurrentJourney} from 'services/currentJourney';
import WebImagePickerCropper from 'screens/TreeSubmission/screens/SelectPhoto/WebImagePickerCropper';
import SelectPhotoButton from './SelectPhotoButton';
import {PickImageButton} from './PickImageButton';
import {locationPermission} from 'utilities/helpers/permissions';
import Geolocation from 'react-native-geolocation-service';
import {calcDistance, TPoint} from 'utilities/distance';
// import piexif from 'piexifjs';

interface Props extends TreeSubmissionStackScreenProps<Routes.SelectPhoto> {}

function SelectPhoto(props: Props) {
  const {navigation} = props;
  const {journey, setNewJourney, clearJourney} = useCurrentJourney();

  const isConnected = useNetInfoConnected();
  const {t} = useTranslation();

  const {dispatchAddOfflineUpdateTree} = useOfflineTrees();
  const [persistedPlantedTrees] = usePersistedPlantedTrees();

  const [photo, setPhoto] = useState<any>();
  const [showWebCam, setShowWebCam] = useState<boolean>(false);
  const [pickedImage, setPickedImage] = useState<File | null>(null);

  const handleAfterSelectPhoto = useAfterSelectPhotoHandler();

  const address = useWalletAccount();

  const {canPlant} = usePlanterStatusQuery(address);

  const {openCameraHook, openLibraryHook} = useCamera();
  const isUpdate = typeof journey?.treeIdToUpdate !== 'undefined';
  const isNursery = journey?.tree?.treeSpecsEntity?.nursery === 'true';
  // @here
  const canUpdate = canUpdateTreeLocation(journey, isNursery);

  useEffect(() => {
    if (typeof journey.isSingle === 'undefined' && !isUpdate) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: Routes.SelectPlantType}],
        }),
      );
    }
    return () => {
      setShowWebCam(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectPhoto = useCallback(
    async (fromGallery: boolean) => {
      if (isWeb()) {
        setShowWebCam(true);
      } else {
        let selectedPhoto;
        if (fromGallery) {
          selectedPhoto = await openLibraryHook();
        } else {
          selectedPhoto = await openCameraHook();
        }
        if (selectedPhoto) {
          if (selectedPhoto.path) {
            // @here
            console.log({selectedPhoto});
            Geolocation.getCurrentPosition(position => {
              let maxDistance = 20.0;
              const userCoords: TPoint = {
                latitude: position?.coords.latitude,
                longitude: position?.coords.longitude,
              };
              const imageCoords: TPoint = {
                latitude: selectedPhoto?.exif.Latitude,
                longitude: selectedPhoto?.exif.Longitude,
              };
              const distance = calcDistance(imageCoords, userCoords);
              console.log({userCoords, imageCoords, distance});

              if (distance < maxDistance) {
                handleAfterSelectPhoto({
                  selectedPhoto,
                  setPhoto,
                  isUpdate,
                  isNursery,
                  canUpdate,
                });
              } else {
                showAlert({
                  title: t('inValidImage.title'),
                  mode: AlertMode.Error,
                  message: t('inValidImage.message'),
                });
              }
            });
          }
        }
      }
    },
    [openLibraryHook, openCameraHook, handleAfterSelectPhoto, isUpdate, isNursery, canUpdate],
  );

  const handlePickPhotoWeb = e => {
    setPickedImage(e.target.files[0]);
  };

  const handleSelectPhotoWeb = useCallback(
    async (image, croppedAreaPixels, rotation) => {
      const file = await getCroppedImg(image, 'file.jpeg', croppedAreaPixels, rotation);
      setPhoto(file);
      setShowWebCam(false);

      handleAfterSelectPhoto({
        selectedPhoto: file,
        setPhoto,
        isUpdate,
        isNursery,
        canUpdate,
      });
    },
    [canUpdate, handleAfterSelectPhoto, isNursery, isUpdate],
  );

  const handleSelectLibraryPhotoWeb = useCallback(
    async (image, croppedAreaPixels, rotation) => {
      const file = await getCroppedImg(image, pickedImage?.name, croppedAreaPixels, rotation);
      setPhoto(file);
      setPickedImage(null);

      handleAfterSelectPhoto({
        selectedPhoto: file,
        setPhoto,
        isUpdate,
        isNursery,
        canUpdate,
      });
    },
    [canUpdate, handleAfterSelectPhoto, isNursery, isUpdate, pickedImage],
  );

  const handleContinue = useCallback(() => {
    console.log(journey, 'journey handleContinue');
    if (isConnected) {
      navigation.navigate(Routes.SubmitTree);
      setNewJourney({
        ...journey,
        photo,
        nurseryContinuedUpdatingLocation: true,
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
      clearJourney();
    }
  }, [
    clearJourney,
    dispatchAddOfflineUpdateTree,
    isConnected,
    journey,
    navigation,
    persistedPlantedTrees,
    photo,
    setNewJourney,
    t,
  ]);

  const handleUpdateLocation = useCallback(() => {
    const updatedTree = persistedPlantedTrees?.find(item => item.id === journey.treeIdToUpdate);
    const newJourney = {
      ...journey,
      photo,
      tree: updatedTree,
    };
    navigation.navigate(Routes.SelectOnMap, {journey: newJourney});
    setNewJourney(newJourney);
  }, [journey, navigation, persistedPlantedTrees, photo, setNewJourney]);

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
        <WebCam handleDone={handleSelectPhotoWeb} handleDismiss={() => setShowWebCam(false)} />
      </Modal>
    );
  }

  if (pickedImage) {
    return (
      <Modal visible transparent style={{flex: 1}}>
        <WebImagePickerCropper
          imageData={pickedImage}
          handleDone={handleSelectLibraryPhotoWeb}
          handleDismiss={() => setPickedImage(null)}
        />
      </Modal>
    );
  }

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill]}>
      {isConnected === false ? <SubmitTreeOfflineWebModal /> : null}
      <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
        <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, {paddingHorizontal: 30}]}>
          <Spacer times={10} />
          <TreeSubmissionStepper currentStep={canUpdate && photo ? 2 : 1}>
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
              <View style={{flexDirection: 'row'}}>
                <SelectPhotoButton onPress={() => handleSelectPhoto(false)} icon="camera" caption={t('openCamera')} />
                <PickImageButton
                  icon="images"
                  onPress={isWeb() ? handlePickPhotoWeb : () => handleSelectPhoto(true)}
                  caption={t('openGallery')}
                />
              </View>
            )}
          </TreeSubmissionStepper>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SelectPhoto;
