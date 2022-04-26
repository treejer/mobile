import {CommonActions, useNavigation} from '@react-navigation/native';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {Routes} from 'navigation';
import React from 'react';
import {isWeb} from 'utilities/helpers/web';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, TouchableOpacity, View, Modal} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

function SubmitTreeOfflineWebModal() {
  const navigation = useNavigation();
  const {t} = useTranslation();
  return isWeb() ? (
    <Modal visible transparent>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modal}>
          <Text style={[{textAlign: 'center'}, globalStyles.h4, globalStyles.mb1]}>
            {t('offlineTreeSubmittingNotSupported')}
          </Text>
          <Text style={globalStyles.h6}>{t('checkNetwork')}</Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() =>
                navigation.dispatch(() =>
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      {
                        name: Routes.MyProfile,
                      },
                    ],
                  }),
                )
              }
            >
              <Text style={styles.btnText}>{t('backToProfile')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  ) : null;
}

export default SubmitTreeOfflineWebModal;

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
  btnText: {
    color: colors.green,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: colors.green,
  },
});
