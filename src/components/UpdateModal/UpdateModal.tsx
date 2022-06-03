import React, {useCallback, useState} from 'react';
import {colors} from 'constants/values';
import GooglePlay from 'react-native-vector-icons/Ionicons';
import {Image, Linking, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TreejerIcon} from '../../../assets/images';
import globalStyles from 'constants/styles';
import {useTranslation} from 'react-i18next';
import {googlePlayUrl} from 'services/config';

function UpdateModal() {
  const [isShow, setIsShow] = useState(false);
  const [isForce, setIsForce] = useState(true);
  const {t} = useTranslation();

  const handlePress = useCallback(() => {
    Linking.openURL(googlePlayUrl);
  }, []);

  return isShow ? (
    <Modal visible>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modal}>
          <View>
            <Image source={TreejerIcon} style={styles.picture} />
          </View>
          <Text style={[globalStyles.h2, styles.ranger]}>{t('loading.ranger')}</Text>
          <Text style={[globalStyles.h4, globalStyles.mb1, styles.treejer]}>{t('loading.by')}</Text>
          <Text style={[styles.bold, globalStyles.h5]}>{t('forceUpdate.versionAvailable')}</Text>
          <Text>{t('forceUpdate.updateContinue')}</Text>
          <View style={styles.btnContainer}>
            {!isForce && (
              <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setIsShow(false)}>
                <Text>{t('close')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.btn, styles.downloadBtn]} onPress={handlePress}>
              <Text style={styles.whiteColor}>
                <GooglePlay name="logo-google-playstore" size={15} /> {t('forceUpdate.download')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  ) : null;
}

export default UpdateModal;

const styles = StyleSheet.create({
  modalContainer: {
    zIndex: 999,
    flex: 1,
    width: '100%',
    backgroundColor: colors.khaki,
  },
  modal: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picture: {
    width: 170,
    height: 170,
    marginVertical: 20,
  },
  ranger: {
    color: colors.black,
    fontWeight: 'bold',
  },

  btnContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  treejer: {
    color: colors.green,
    fontWeight: 'bold',
  },
  btn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    flexDirection: 'row',
  },
  downloadBtn: {
    backgroundColor: colors.green,
    marginLeft: 5,
  },
  cancelBtn: {
    backgroundColor: colors.khakiDark,
  },
  whiteColor: {
    color: '#fff',
  },
  bold: {
    fontWeight: 'bold',
  },
});
