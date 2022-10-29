import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {QrFrame} from '../../../assets/images';

export type TQrReaderProps = {
  handleScan: (data: string) => void;
  handleDismiss: () => void;
};

export function QrReader(props: TQrReaderProps) {
  const {handleScan, handleDismiss} = props;

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({type, data}) => {
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Modal>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        type="back"
        // barCodeTypes={['qrcode']}
      />
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
    flex: 1,
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
