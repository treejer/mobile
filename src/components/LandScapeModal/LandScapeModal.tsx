import React from 'react';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {useTranslation} from 'react-i18next';
import {Modal, View, Text, StyleSheet, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useOrientation} from 'utilities/hooks';
import {RotateIcon} from '../../../assets/images';

function LandScapeModal() {
  const isLandscape = useOrientation();
  const {t} = useTranslation();

  return isLandscape ? (
    <Modal visible style={styles.modalContainer}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.modal}>
          <Image source={RotateIcon} style={styles.picture} />
          <Text style={[globalStyles.h4, styles.message]}>{t('rotate')}</Text>
        </View>
      </SafeAreaView>
    </Modal>
  ) : null;
}

export default LandScapeModal;

const styles = StyleSheet.create({
  modalContainer: {
    zIndex: 999,
    flex: 1,
    width: '100%',
    backgroundColor: colors.grayOpacity,
  },
  safe: {
    flex: 1,
  },
  modal: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 6,
    shadowOffset: {
      width: 2,
      height: 6,
    },
    shadowRadius: 40,
    shadowColor: 'black',
    shadowOpacity: 0.5,
  },
  picture: {
    width: 70,
    height: 70,
    marginVertical: 20,
  },
  message: {
    color: colors.green,
    fontWeight: 'bold',
  },
});
