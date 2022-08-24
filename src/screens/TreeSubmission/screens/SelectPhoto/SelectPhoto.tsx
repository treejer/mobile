import globalStyles from 'constants/styles';

import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import {TPoint} from 'utilities/helpers/distance';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import CheckPermissions from 'screens/TreeSubmission/components/CheckPermissions/CheckPermissions';
import {useCheckTreePhoto} from 'utilities/hooks/useCheckTreePhoto';

interface Props extends TreeSubmissionStackScreenProps<Routes.SelectPhoto> {
  plantTreePermissions: TUsePlantTreePermissions;
}

function SelectPhoto(props: Props) {
  const {navigation, plantTreePermissions} = props;
  const {userLocation, showPermissionModal} = plantTreePermissions;

  const {journey, setNewJourney, clearJourney} = useCurrentJourney();

  const isConnected = useNetInfoConnected();
  const {t} = useTranslation();

  const {dispatchAddOfflineUpdateTree} = useOfflineTrees();
  const [persistedPlantedTrees] = usePersistedPlantedTrees();

  const [photo, setPhoto] = useState<any>();
  const [showWebCam, setShowWebCam] = useState<boolean>(false);
  const [pickedImage, setPickedImage] = useState<File | null>(null);

  const handleAfterSelectPhoto = useAfterSelectPhotoHandler();
  const checkTreePhoto = useCheckTreePhoto();

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

        const imageCoords: TPoint = {
          latitude: selectedPhoto?.exif.Latitude,
          longitude: selectedPhoto?.exif.Longitude,
        };

        if (selectedPhoto) {
          if (selectedPhoto.path) {
            checkTreePhoto(
              '',
              userLocation,
              () => {
                handleAfterSelectPhoto({
                  selectedPhoto,
                  setPhoto,
                  isUpdate,
                  isNursery,
                  canUpdate,
                });
              },
              imageCoords,
              fromGallery,
            );
            // if (selectedPhoto?.exif.Latitude && selectedPhoto?.exif.Longitude) {
            //   // @here
            //   let maxDistance = 5;
            //   if (userLocation) {
            //     const distance = calcDistance(imageCoords, userLocation);
            //     console.log({userLocation, imageCoords, distance});

            //     if (distance < maxDistance) {
            //       handleAfterSelectPhoto({
            //         selectedPhoto,
            //         setPhoto,
            //         isUpdate,
            //         isNursery,
            //         canUpdate,
            //       });
            //     } else {
            //       showAlert({
            //         title: t('inValidImage.title'),
            //         mode: AlertMode.Error,
            //         message: t('inValidImage.longDistance'),
            //       });
            //     }
            //   }
            // } else {
            //   if (fromGallery) {
            //     showAlert({
            //       title: t('inValidImage.title'),
            //       mode: AlertMode.Error,
            //       message: t('inValidImage.message'),
            //     });
            //   } else {
            //     showAlert({
            //       title: t('inValidImage.title'),
            //       mode: AlertMode.Error,
            //       message: t('inValidImage.hasNoLocation'),
            //     });
            //   }
            // }
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      checkTreePhoto(image, userLocation, () => {
        handleAfterSelectPhoto({
          selectedPhoto: file,
          setPhoto,
          isUpdate,
          isNursery,
          canUpdate,
        });
      });

      // const {latitude, longitude} = await exifr.parse(image);
      // if (latitude > 0 && longitude > 0) {
      //   let maxDistance = 5;

      //   if (userLocation) {
      //     const imageCoords: TPoint = {
      //       latitude,
      //       longitude,
      //     };
      //     const distance = calcDistance(imageCoords, userLocation);
      //     console.log({userLocation, imageCoords, distance});
      //     if (distance < maxDistance) {
      //       handleAfterSelectPhoto({
      //         selectedPhoto: file,
      //         setPhoto,
      //         isUpdate,
      //         isNursery,
      //         canUpdate,
      //       });
      //     } else {
      //       showAlert({
      //         title: t('inValidImage.title'),
      //         mode: AlertMode.Error,
      //         message: t('inValidImage.longDistance'),
      //       });
      //     }
      //   } else {
      //     showAlert({
      //       title: t('inValidImage.title'),
      //       mode: AlertMode.Error,
      //       message: t('inValidImage.hasNoLocation'),
      //     });
      //   }
      // }
    },
    [canUpdate, checkTreePhoto, handleAfterSelectPhoto, isNursery, isUpdate, userLocation],
  );

  const handleSelectLibraryPhotoWeb = useCallback(
    async (image, croppedAreaPixels, rotation) => {
      const file = await getCroppedImg(image, pickedImage?.name, croppedAreaPixels, rotation);
      setPhoto(file);
      setPickedImage(null);

      checkTreePhoto(image, userLocation, () => {
        handleAfterSelectPhoto({
          selectedPhoto: file,
          setPhoto,
          isUpdate,
          isNursery,
          canUpdate,
        });
      });

      // const {latitude, longitude} = await exifr.parse(image);
      // if (latitude > 0 && longitude > 0) {
      //   let maxDistance = 5;
      //   if (userLocation) {
      //     const imageCoords: TPoint = {
      //       latitude,
      //       longitude,
      //     };
      //     const distance = calcDistance(imageCoords, userLocation);
      //     console.log({userLocation, imageCoords, distance});
      //     if (distance < maxDistance) {
      //       handleAfterSelectPhoto({
      //         selectedPhoto: file,
      //         setPhoto,
      //         isUpdate,
      //         isNursery,
      //         canUpdate,
      //       });
      //     } else {
      //       showAlert({
      //         title: t('inValidImage.title'),
      //         mode: AlertMode.Error,
      //         message: t('inValidImage.longDistance'),
      //       });
      //     }
      //   } else {
      //     showAlert({
      //       title: t('inValidImage.title'),
      //       mode: AlertMode.Error,
      //       message: t('inValidImage.hasNoLocation'),
      //     });
      //   }
      // }
    },
    [canUpdate, checkTreePhoto, handleAfterSelectPhoto, isNursery, isUpdate, pickedImage?.name, userLocation],
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

  if (showPermissionModal) {
    return <CheckPermissions plantTreePermissions={plantTreePermissions} />;
  }

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
