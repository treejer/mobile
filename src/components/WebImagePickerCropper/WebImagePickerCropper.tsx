import React, {useCallback, useEffect, useState} from 'react';
import Cropper from 'react-easy-crop';
import {useTranslation} from 'react-i18next';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from 'constants/values';

const bottomSheetSpace = 80;

interface WebCamProps {
  imageData: File;
  handleDone: (image: string | ArrayBuffer | null, croppedAreaPixels: number | null, rotation: number) => void;
}

function WebImagePickerCropper(props: WebCamProps) {
  const {handleDone, imageData} = props;

  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({x: 0, y: 0});
  const [rotation, setRotation] = useState(0);
  const [image, setImage] = useState<string | ArrayBuffer | null>('');

  const {t} = useTranslation();

  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(imageData);
  }, []);

  const onCropComplete = useCallback((croppedArea, _croppedAreaPixels) => {
    setCroppedAreaPixels(_croppedAreaPixels);
  }, []);

  const doneHandler = useCallback(
    () => handleDone(image, croppedAreaPixels, rotation),
    [croppedAreaPixels, handleDone, imageData, rotation],
  );

  return (
    <>
      <View style={{flex: 1, position: 'relative'}}>
        {image ? (
          <Cropper
            image={`${image}`}
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
                height: '100%',
                width: '100%',
              },
            }}
          />
        ) : null}
      </View>
      <View>
        <View style={styles.cameraBottomSheet}>
          <TouchableOpacity style={styles.confirmationButton} onPress={doneHandler}>
            <Text style={styles.text}>{t('done')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default WebImagePickerCropper;

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
