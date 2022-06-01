import React, {useCallback, useEffect, useState} from 'react';
import Cropper from 'react-easy-crop';
import {useTranslation} from 'react-i18next';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from 'constants/values';
import Icon from 'react-native-vector-icons/AntDesign';

const bottomSheetSpace = 80;

interface WebCamProps {
  imageData: File;
  handleDone: (image: string | ArrayBuffer | null, croppedAreaPixels: number | null, rotation: number) => void;
  handleDismiss: () => void;
}

function WebImagePickerCropper(props: WebCamProps) {
  const {handleDone, imageData, handleDismiss} = props;

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
  }, [imageData]);

  const onCropComplete = useCallback((croppedArea, _croppedAreaPixels) => {
    setCroppedAreaPixels(_croppedAreaPixels);
  }, []);

  const doneHandler = useCallback(
    () => handleDone(image, croppedAreaPixels, rotation),
    [croppedAreaPixels, handleDone, image, rotation],
  );

  return (
    <View style={{backgroundColor: colors.grayOpacity, flex: 1}}>
      <View style={{flex: 1, position: 'relative', maxWidth: 768, width: '100%', margin: 'auto'}}>
        <View style={{flex: 1}}>
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
                containerStyle: {maxWidth: 768, height: `calc(100% - ${bottomSheetSpace}px)`},
              }}
            />
          ) : null}
        </View>
        <View style={styles.cameraBottomSheet}>
          <TouchableOpacity style={styles.confirmationButton} onPress={doneHandler}>
            <Text style={styles.text}>{t('done')}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.close} onPress={handleDismiss}>
          <Icon name="closecircle" size={40} color={colors.red} />
        </TouchableOpacity>
      </View>
    </View>
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
  close: {
    position: 'absolute',
    top: 16,
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.khaki,
    borderRadius: 100,
    height: 40,
  },
});
