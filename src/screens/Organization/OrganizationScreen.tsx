import React from 'react';
import {useNavigation} from '@react-navigation/native';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {Routes} from 'navigation';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

function OrganizationScreen() {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const handleAccept = () => {
    // @ts-ignore
    navigation.navigate(Routes.UnVerifiedProfileStack, {screen: Routes.VerifyProfile});
  };

  const handleReject = () => {
    // @ts-ignore
    navigation.navigate(Routes.UnVerifiedProfileStack, {screen: Routes.MyProfile});
  };

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.fill, globalStyles.justifyContentCenter, globalStyles.alignItemsCenter]}>
        <Text style={[globalStyles.h4, globalStyles.mb1]}>{t('organization.invited')}</Text>
        <Text style={[styles.organizationAddress]} numberOfLines={1}>
          {'asdgsadgsdfsdfsdafsdafsdfsdfsdf'?.slice(0, 15)}...
        </Text>
        <Image
          source={require('../../assets/images/no-wallet.png')}
          resizeMode="contain"
          style={{width: 280, height: 180, alignSelf: 'center'}}
        />
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={handleAccept}>
            <Text style={[styles.btn, styles.acceptBtn]}>{t('organization.accept')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReject}>
            <Text style={[styles.btn, styles.rejectBtn]}>{t(`organization.reject`)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default OrganizationScreen;

const styles = StyleSheet.create({
  btnContainer: {
    width: '100%',
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  btn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  acceptBtn: {
    backgroundColor: colors.green,
    color: '#fff',
  },
  rejectBtn: {
    backgroundColor: colors.grayLighter,
  },
  organizationAddress: {
    backgroundColor: colors.khakiDark,
    textAlign: 'center',
    borderColor: 'white',
    overflow: 'hidden',
    width: 180,
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
});
