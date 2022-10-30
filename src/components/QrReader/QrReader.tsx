import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {useTranslation} from 'react-i18next';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import Spacer from 'components/Spacer';
import {QrFrame} from '../../../assets/images';

export type TQrReaderProps = {
  handleScan: (data: string) => void;
  handleDismiss: () => void;
};

export function QrReader(props: TQrReaderProps) {
  const {handleScan, handleDismiss} = props;

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const {t} = useTranslation();

  useEffect(() => {
    (async () => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({type, data}) => {
    handleScan(data);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.requesting}>
        <Spacer times={12} />
        <Text style={styles.reqText}>{t('transfer.requesting')}</Text>
        <Spacer times={4} />
        <ActivityIndicator color={colors.green} size="large" />
      </View>
    );
  }
  if (!hasPermission) {
    return (
      <View style={styles.requesting}>
        <Spacer times={12} />
        <Text style={styles.reqText}>{t('transfer.noCameraPermission')}</Text>
        <Spacer times={4} />
        <Icon name="smileo" size={24} color={colors.green} />
      </View>
    );
  }

  return (
    <Modal>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={{width: '100%', height: '100%'}}
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
  reqText: {
    fontSize: 22,
    color: colors.green,
  },
  requesting: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
