import React from 'react';
import {ActivityIndicator, Image, Text, View} from 'react-native';
import {colors} from 'constants/values';
import treejerIcon from '../../../assets/images/icon.png';
import {useTranslation} from 'react-i18next';
import globalStyles from 'constants/styles';
import AppVersion from 'components/AppVersion';

export function AppLoading() {
  const {t} = useTranslation();

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.khaki}}>
      <Image source={treejerIcon} style={{width: 240, height: 240}} />
      <Text style={{...globalStyles.h1, paddingVertical: 16, fontWeight: 'bold'}}>{t('loading.ranger')}</Text>
      <Text style={{...globalStyles.h5, paddingVertical: 16, color: colors.green, fontWeight: 'bold'}}>
        {t('loading.by')}
      </Text>
      <ActivityIndicator color={colors.green} size="large" style={{marginVertical: 24}} />
      <AppVersion />
    </View>
  );
}
