import WebCam from 'components/WebCam/WebCam';
import globalStyles from 'constants/styles';
import {RootNavigationProp, Routes} from 'navigation';
import React, {useCallback, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {canUpdateTreeLocation, useAfterSelectPhotoHandler} from 'utilities/helpers/submitTree';
import getCroppedImg from 'utilities/hooks/cropImage';

export interface ThreeSubmissionWebCamProps extends RootNavigationProp<Routes.ThreeSubmissionWebCam> {}

function ThreeSubmissionWebCam(props: ThreeSubmissionWebCamProps) {
  const {route} = props;
  const {
    params: {journey},
  } = route;

  const handleDone = async (image, croppedAreaPixels, rotation, handleAfterSelectPhoto) => {
    try {
      const selectedPhoto = await getCroppedImg(image, '', croppedAreaPixels, rotation);
      const isNursery = journey?.tree?.treeSpecsEntity?.nursery === 'true';
      const isUpdate = typeof journey?.treeIdToUpdate !== 'undefined';
      const canUpdate = canUpdateTreeLocation(journey, isNursery);

      // @here
      handleAfterSelectPhoto({
        journey,
        isNursery,
        canUpdate,
        isUpdate,
        selectedPhoto,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <WebCam journey={journey} handleDone={handleDone} />
    </SafeAreaView>
  );
}

export default ThreeSubmissionWebCam;
