import React, {useCallback, useMemo, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import globalStyles from 'constants/styles';
import Webcam from 'react-webcam';
import {colors} from 'constants/values';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useWindowSize} from 'utilities/hooks/useWindowSize';
import {useTranslation} from 'react-i18next';
import {RootNavigationProp, Routes} from 'navigation';
import Cropper from 'react-easy-crop';
import getCroppedImg from 'utilities/hooks/cropImage';
import {canUpdateTreeLocation, useAfterSelectPhotoHandler} from 'utilities/helpers/submitTree';

export interface WebCamScreenProps extends RootNavigationProp<Routes.WebCamera> {}

const bottomSheetSpace = 80;

export function WebCameraScreen(props: WebCamScreenProps) {
  const {route} = props;

  const {
    params: {journey},
  } = route;

  const [crop, setCrop] = useState({x: 0, y: 0});
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const {t} = useTranslation();

  const [image, setImage] = useState<string>('');
  const webcamRef = useRef<Webcam>(null);

  const {
    screenSize: {width, height},
  } = useWindowSize();
  const videoHeight = useMemo(() => height - bottomSheetSpace, [height]);
  const videoConstraints = useMemo(
    () => ({
      width,
      height: videoHeight,
      facingMode: 'environment',
    }),
    [videoHeight, width],
  );

  const handleAfterSelectPhoto = useAfterSelectPhotoHandler();

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({width, height: videoHeight});
    console.log(imageSrc, 'imageSrc');
    if (imageSrc) {
      setImage(imageSrc);
    }
  }, [videoHeight, width, webcamRef]);
  const handleRetry = useCallback(() => {
    setImage('');
  }, []);
  const onCropComplete = useCallback((croppedArea, _croppedAreaPixels) => {
    setCroppedAreaPixels(_croppedAreaPixels);
  }, []);
  const handleDone = useCallback(async () => {
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
  }, [croppedAreaPixels, handleAfterSelectPhoto, image, journey, rotation]);

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <View style={{flex: 1, position: 'relative'}}>
        {image ? (
          <Cropper
            image={image}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            aspect={3 / 4}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            style={{containerStyle: {height: `calc(100% - ${bottomSheetSpace}px)`}}}
          />
        ) : (
          <Webcam ref={webcamRef} mirrored screenshotFormat="image/png" videoConstraints={videoConstraints} />
        )}
      </View>
      <View>
        <View style={styles.cameraBottomSheet}>
          {image ? (
            <>
              <TouchableOpacity style={styles.confirmationButton} onPress={handleRetry}>
                <Text style={styles.text}>{t('retry')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmationButton} onPress={handleDone}>
                <Text style={styles.text}>{t('done')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
              <Icon name="camera" size={24} color={colors.black} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cameraBottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: bottomSheetSpace,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.khaki,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmationButton: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.khaki,
  },
});
