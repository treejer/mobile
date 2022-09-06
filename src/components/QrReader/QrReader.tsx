import React from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/AntDesign';
import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {QrFrame} from '../../../assets/images';

export type TQrReaderProps = {
  handleScan: (data: any) => void;
  handleDismiss: () => void;
};

export function QrReader(props: TQrReaderProps) {
  const {handleScan, handleDismiss} = props;

  return (
    <Modal>
      <QRCodeScanner
        cameraStyle={{height: '100%'}}
        onRead={handleScan}
        flashMode={RNCamera.Constants.FlashMode.auto}
        // showMarker
        fadeIn
      />
      <View style={styles.areaContainer}>
        <View style={globalStyles.fill}>
          <TouchableOpacity style={styles.close} onPress={handleDismiss}>
            <Icon name="closecircle" size={40} color={colors.red} />
          </TouchableOpacity>
        </View>
        <View style={styles.scanArea}>
          <Image source={QrFrame} style={styles.scanAreaImage} />
        </View>
        <View style={globalStyles.fill} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  areaContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scanArea: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 3,
  },
  scanAreaImage: {
    width: 250,
    height: 250,
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
