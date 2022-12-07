import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, Text, View, Modal} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Routes} from 'navigation/index';
import globalStyles from 'constants/styles';
import {maxDistanceInMeters} from 'services/config';
import {useCurrentJourney} from 'services/currentJourney';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import WebCam from 'components/WebCam/WebCam';
import {TreeFilter} from 'components/TreeList/TreeFilterItem';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import SubmitTreeOfflineWebModal from 'components/SubmitTreeOfflineWebModal/SubmitTreeOfflineWebModal';
import {isWeb} from 'utilities/helpers/web';
import {Hex2Dec} from 'utilities/helpers/hex';
import {useCamera} from 'utilities/hooks';
import {checkExif} from 'utilities/helpers/checkExif';
import getCroppedImg from 'utilities/helpers/cropImage';
import {useOfflineTrees} from 'utilities/hooks/useOfflineTrees';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {useCheckTreePhoto} from 'utilities/hooks/useCheckTreePhoto';
import {useBrowserPlatform} from 'utilities/hooks/useBrowserPlatform';
import usePlanterStatusQuery from 'utilities/hooks/usePlanterStatusQuery';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {usePersistedPlantedTrees} from 'utilities/hooks/usePlantedTrees';
import {calcDistanceInMeters, TPoint} from 'utilities/helpers/distanceInMeters';
import {canUpdateTreeLocation, useAfterSelectPhotoHandler} from 'utilities/helpers/submitTree';
import {TreeSubmissionStackScreenProps} from 'screens/TreeSubmission/TreeSubmission';
import TreeSubmissionStepper from 'screens/TreeSubmission/components/TreeSubmissionStepper';
import WebImagePickerCropper from 'screens/TreeSubmission/screens/SelectPhoto/WebImagePickerCropper';
import CheckPermissions from 'screens/TreeSubmission/components/CheckPermissions/CheckPermissions';
import {useConfig, useWalletAccount} from 'ranger-redux/modules/web3/web3';
import {useSettings} from 'ranger-redux/modules/settings/settings';
import SelectPhotoButton from './SelectPhotoButton';
import {PickImageButton} from './PickImageButton';

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
  const [photoLocation, setPhotoLocation] = useState<TPoint | null>(null);

  const handleAfterSelectPhoto = useAfterSelectPhotoHandler();
  const checkTreePhoto = useCheckTreePhoto();
  const browserPlatform = useBrowserPlatform();
  const address = useWalletAccount();
  const {isMainnet} = useConfig();
  const {checkMetaData} = useSettings();

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
              imageLocation => {
                handleAfterSelectPhoto({
                  selectedPhoto,
                  setPhoto,
                  isUpdate,
                  isNursery,
                  canUpdate,
                  imageLocation,
                });
                setPhotoLocation(imageLocation);
              },
              imageCoords,
              fromGallery,
            );
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openLibraryHook, openCameraHook, handleAfterSelectPhoto, isUpdate, isNursery, canUpdate, checkTreePhoto],
  );

  const handlePickPhotoWeb = e => {
    setPickedImage(e.target.files[0]);
  };

  const handleSelectPhotoWeb = useCallback(
    async (image, croppedAreaPixels, rotation) => {
      const file = await getCroppedImg(image, 'file.jpeg', croppedAreaPixels, rotation);
      setShowWebCam(false);

      checkTreePhoto(image, userLocation, imageLocation => {
        handleAfterSelectPhoto({
          selectedPhoto: file,
          setPhoto,
          isUpdate,
          isNursery,
          canUpdate,
          imageLocation,
        });
        setPhotoLocation(imageLocation);
      });
    },
    [canUpdate, checkTreePhoto, handleAfterSelectPhoto, isNursery, isUpdate, userLocation],
  );

  const handleSelectLibraryPhotoWeb = useCallback(
    async (image, croppedAreaPixels, rotation) => {
      const file = await getCroppedImg(image, pickedImage?.name, croppedAreaPixels, rotation);
      setPickedImage(null);

      checkTreePhoto(image, userLocation, imageLocation => {
        handleAfterSelectPhoto({
          selectedPhoto: file,
          setPhoto,
          isUpdate,
          isNursery,
          canUpdate,
          imageLocation,
        });
        setPhotoLocation(imageLocation);
      });
    },
    [canUpdate, checkTreePhoto, handleAfterSelectPhoto, isNursery, isUpdate, pickedImage?.name, userLocation],
  );

  const handleContinue = useCallback(() => {
    const distance = calcDistanceInMeters(
      {
        latitude: journey?.photoLocation?.latitude || 0,
        longitude: journey?.photoLocation?.longitude || 0,
      },
      {
        latitude: Number(journey?.tree?.treeSpecsEntity?.latitude) / Math.pow(10, 6),
        longitude: Number(journey?.tree?.treeSpecsEntity?.longitude) / Math.pow(10, 6),
      },
    );
    if (isConnected) {
      if (
        distance < maxDistanceInMeters ||
        (isWeb() && browserPlatform === 'iOS') ||
        !checkExif(isMainnet, checkMetaData)
      ) {
        navigation.navigate(Routes.SubmitTree);
        setNewJourney({
          ...journey,
          photo,
          nurseryContinuedUpdatingLocation: true,
        });
      } else {
        showAlert({
          title: t('map.updateSingleTree.errTitle'),
          mode: AlertMode.Error,
          message: t('map.updateSingleTree.errMessage', {plantType: 'nursery'}),
        });
      }
    } else {
      if (
        distance < maxDistanceInMeters ||
        (isWeb() && browserPlatform === 'iOS') ||
        !checkExif(isMainnet, checkMetaData)
      ) {
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
      } else {
        showAlert({
          title: t('map.updateSingleTree.errTitle'),
          mode: AlertMode.Error,
          message: t('map.updateSingleTree.errMessage', {plantType: 'nursery '}),
        });
      }
    }
  }, [
    browserPlatform,
    checkMetaData,
    clearJourney,
    dispatchAddOfflineUpdateTree,
    isConnected,
    isMainnet,
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
      photoLocation,
      tree: updatedTree,
    };
    navigation.navigate(Routes.SelectOnMap, {journey: newJourney});
    setNewJourney(newJourney);
  }, [journey, navigation, persistedPlantedTrees, photo, photoLocation, setNewJourney]);

  if (showPermissionModal) {
    return <CheckPermissions plantTreePermissions={plantTreePermissions} />;
  }

  // if (canPlant === false) {
  //   return (
  //     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30}}>
  //       <Text style={{textAlign: 'center', fontSize: 18}}>{t('supplyCapReached')}</Text>
  //     </View>
  //   );
  // }

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

  const isSingle = journey?.isSingle;
  const count = journey?.nurseryCount;

  const title = isSingle
    ? 'submitTree.submitTree'
    : isSingle === false
    ? 'submitTree.nurseryCount'
    : isUpdate
    ? 'submitTree.updateTree'
    : 'submitTree.submitTree';

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill]}>
      {isConnected === false ? <SubmitTreeOfflineWebModal /> : null}
      <ScreenTitle title={`${t(title, {count})} ${isUpdate ? `#${Hex2Dec(journey.tree?.id!)}` : ''}`} />
      <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
        <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, {paddingHorizontal: 30}]}>
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
