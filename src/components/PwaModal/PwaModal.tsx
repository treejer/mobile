import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Share from 'react-native-vector-icons/Entypo';
import GooglePlay from 'react-native-vector-icons/Ionicons';
import {StyleSheet, Text, TouchableOpacity, View, Image, Linking, Modal} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TreejerIcon} from '../../../assets/images';
import {useBrowserPlatform} from '../../utilities/hooks/useBrowserPlatform';
import {useTranslation} from 'react-i18next';

function PwaModal() {
  const [isShow, setIsShow] = useState(!window.matchMedia('(display-mode: standalone)').matches);
  const browserPlatform = useBrowserPlatform();
  const {t} = useTranslation();

  const GOOGLEPLAYAPPURL = useMemo(() => 'https://play.google.com/store/apps/details?id=com.treejer.ranger', []);

  const handlePress = useCallback(() => {
    Linking.openURL(GOOGLEPLAYAPPURL);
  }, []);

  return isShow && browserPlatform ? (
    <Modal visible transparent>
      <SafeAreaView style={styles.modalContainer}>
        <View style={[styles.modal, globalStyles.normal]}>
          <View>
            <Image source={TreejerIcon} style={{width: 70, height: 70, borderRadius: 27, marginBottom: 20}} />
          </View>
          <Text style={[globalStyles.h3, globalStyles.mb1]}>{t('Install App')}</Text>
          <Text style={globalStyles.h6}>
            {t(`addToHomeScreen.tap`)} <Share name="share-alternative" size={15} /> {t(`addToHomeScreen.homeScreen`)}
          </Text>
          {browserPlatform === 'Android' && <Text style={styles.downloadMessage}>{t('canDownload')}</Text>}
          <View style={[styles.btnContainer, globalStyles.mt3]}>
            <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={() => setIsShow(false)}>
              <Text>{t('close')}</Text>
            </TouchableOpacity>
            {browserPlatform === 'Android' && (
              <TouchableOpacity style={[styles.btn, styles.downloadBtn]} onPress={handlePress}>
                <Text style={styles.whiteColor}>
                  <GooglePlay name="logo-google-playstore" size={15} /> {t('Google Play')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  ) : null;
}

export default PwaModal;

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9,
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100vh',
    backgroundColor: colors.grayOpacity,
    padding: 5,
  },
  modal: {
    width: 250,
    padding: 15,
    borderRadius: 8,
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
  btnContainer: {
    flexDirection: 'row',
  },
  btn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    flexDirection: 'row',
  },
  cancelBtn: {
    backgroundColor: colors.khakiDark,
  },
  downloadBtn: {
    backgroundColor: colors.green,
    marginLeft: 5,
  },
  logo: {
    width: 54,
    height: 54,
    backgroundColor: colors.green,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteColor: {
    color: '#fff',
  },
  downloadMessage: {
    margin: 5,
    color: colors.grayDarker,
    fontSize: 12,
  },
});
