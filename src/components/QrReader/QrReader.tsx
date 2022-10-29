import React from 'react';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/AntDesign';
import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {QrFrame} from '../../../assets/images';

export type TQrReaderProps = {
  handleScan: (data: string) => void;
  handleDismiss: () => void;
};

export function QrReader(props: TQrReaderProps) {
  const {handleScan, handleDismiss} = props;

  return (
    <Modal>
      {/*<QRCodeScanner*/}
      {/*  cameraStyle={styles.scanner}*/}
      {/*  onRead={result => handleScan(result.data)}*/}
      {/*  flashMode={RNCamera.Constants.FlashMode.auto}*/}
      {/*  fadeIn={false}*/}
      {/*/>*/}
      <View style={styles.areaContainer}>
        <View style={[styles.darkArea, globalStyles.fill]}>
          <TouchableOpacity style={styles.close} onPress={handleDismiss}>
            <Icon name="closecircle" size={40} color={colors.red} />
          </TouchableOpacity>
        </View>
        <View style={[styles.row]}>
          <View style={[globalStyles.fill, styles.darkArea]} />
          <View>
            <Image source={QrFrame} style={styles.scanAreaImage} />
          </View>
          <View style={[globalStyles.fill, styles.darkArea]} />
        </View>
        <View style={[styles.darkArea, globalStyles.fill]} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scanner: {
    height: '100%',
  },
  areaContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scanAreaImage: {
    width: 250,
    height: 250,
  },
  darkArea: {
    backgroundColor: '#00000066',
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
  row: {
    flexDirection: 'row',
  },
});
