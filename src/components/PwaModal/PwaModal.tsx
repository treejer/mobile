import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TreejerIcon} from '../../../assets/images';
import {useBrowserPlatform} from '../../utilities/hooks/useBrowserPlatform';

function PwaModal() {
  const [isShow, setIsShow] = useState(!window.matchMedia('(display-mode: standalone)').matches);
  const browserPlatform = useBrowserPlatform();

  return isShow && browserPlatform ? (
    <SafeAreaView style={styles.modalContainer}>
      <View style={[styles.modal, globalStyles.normal]}>
        <View>
          <Image source={TreejerIcon} style={{width: 70, height: 70, borderRadius: 27, marginBottom: 20}} />
        </View>
        <Text style={[globalStyles.h3, globalStyles.mb1]}>Install App</Text>
        <Text style={globalStyles.h6}>
          Tap <Icon name="share-alternative" size={15} /> then "Add to Home screen"
        </Text>
        <View style={[styles.btnContainer, globalStyles.mt3]}>
          <TouchableOpacity style={styles.btn} onPress={() => setIsShow(false)}>
            <Text>close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
    height: 250,
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
    shadowOpacity: 0.3,
  },
  btnContainer: {
    flexDirection: 'row',
  },
  btn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: colors.khakiDark,
  },
  logo: {
    width: 54,
    height: 54,
    backgroundColor: colors.green,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
