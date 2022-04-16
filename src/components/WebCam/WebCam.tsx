import React, {useCallback, useMemo, useRef, useState} from 'react';
import Cropper from 'react-easy-crop';
import {useTranslation} from 'react-i18next';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Webcam from 'react-webcam';
import {TreeJourney} from 'screens/TreeSubmission/types';
import {AfterSelectPhotoHandler, canUpdateTreeLocation, useAfterSelectPhotoHandler} from 'utilities/helpers/submitTree';
import getCroppedImg from 'utilities/hooks/cropImage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useWindowSize} from 'utilities/hooks/useWindowSize';
import {colors} from 'constants/values';

const bottomSheetSpace = 80;

interface WebCamProps {
  journey?: TreeJourney;
  handleDone: (
    image: string,
    croppedAreaPixels: number | null,
    rotation: number,
    handleAfterSelectPhoto: (options: AfterSelectPhotoHandler) => void,
  ) => void;
}

function WebCam({journey, handleDone}: WebCamProps) {
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({x: 0, y: 0});
  const [rotation, setRotation] = useState(0);

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

  const doneHandler = useCallback(
    () => handleDone(image, croppedAreaPixels, rotation, handleAfterSelectPhoto),
    [croppedAreaPixels, handleAfterSelectPhoto, image, journey, rotation],
  );

  return (
    <>
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
            style={{
              containerStyle: {height: `calc(100% - ${bottomSheetSpace}px)`},
              mediaStyle: {
                height: `calc(100% - ${bottomSheetSpace}px`,
                width: '100%',
              },
            }}
          />
        ) : (
          <Webcam ref={webcamRef} screenshotFormat="image/png" videoConstraints={videoConstraints} />
        )}
      </View>
      <View>
        <View style={styles.cameraBottomSheet}>
          {image ? (
            <>
              <TouchableOpacity style={styles.confirmationButton} onPress={handleRetry}>
                <Text style={styles.text}>{t('retry')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmationButton} onPress={doneHandler}>
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
    </>
  );
}

export default WebCam;

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
