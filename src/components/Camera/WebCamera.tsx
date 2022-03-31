import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import globalStyles from 'constants/styles';
import Webcam from 'react-webcam';
import {colors} from 'constants/values';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useWindowSize} from 'utilities/hooks/useWindowSize';
import {useTranslation} from 'react-i18next';

export function WebCamera() {
  const {t} = useTranslation();

  const [image, setImage] = useState<string>('');
  const webcamRef = useRef<Webcam>(null);

  const {
    screenSize: {width, height},
  } = useWindowSize();
  const videoHeight = useMemo(() => height - 80, [height]);
  const videoConstraints = useMemo(
    () => ({
      width,
      height: videoHeight,
      facingMode: 'environment',
    }),
    [videoHeight, width],
  );

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({width, height: videoHeight});
    if (imageSrc) {
      setImage(imageSrc);
    }
  }, [videoHeight, width, webcamRef]);
  const handleRetry = useCallback(() => {
    setImage('');
  }, []);

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      {image ? (
        <Image source={{uri: image}} style={{width, height: videoHeight}} />
      ) : (
        <Webcam ref={webcamRef} mirrored screenshotFormat="image/png" videoConstraints={videoConstraints} />
      )}
      <View style={styles.cameraBottomSheet}>
        {image ? (
          <>
            <TouchableOpacity style={styles.confirmationButton} onPress={handleRetry}>
              <Text style={styles.text}>{t('retry')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmationButton} onPress={handleRetry}>
              <Text style={styles.text}>{t('ok')}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
            <Icon name="camera" size={24} color={colors.black} />
          </TouchableOpacity>
        )}
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
    height: 80,
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
