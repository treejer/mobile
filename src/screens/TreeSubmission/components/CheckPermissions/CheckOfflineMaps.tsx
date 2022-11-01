import React from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationProp} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';

import globalStyles from 'constants/styles';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import Spacer from 'components/Spacer';
import Button from 'components/Button';
import {Routes} from 'navigation/Navigation';
import {colors} from 'constants/values';

export type CheckOfflineMaps = {
  navigation: NavigationProp<any>;
};

export function CheckOfflineMaps(props: CheckOfflineMaps) {
  const {navigation} = props;
  const {t} = useTranslation();

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <ScreenTitle title={t('submitTree.noOfflineMapToContinue.title')} />
        <Spacer times={8} />
        <View style={{paddingHorizontal: 24}}>
          <Text style={[{textAlign: 'center'}, globalStyles.h5, {color: colors.grayLight}]}>
            {t('submitTree.noOfflineMapToContinue.details')}
          </Text>
          <Spacer times={8} />
          <Icon name="arrow-down" size={40} style={{alignSelf: 'center'}} />
          <Spacer times={8} />
          <Text style={[{textAlign: 'center'}, globalStyles.h6]}>
            {t('submitTree.noOfflineMapToContinue.continue')}
          </Text>
          <Spacer times={8} />
          <Button
            caption={t('submitTree.noOfflineMapToContinue.download')}
            variant="success"
            style={{justifyContent: 'center'}}
            onPress={() => navigation.navigate(Routes.OfflineMap)}
          />
          <Spacer times={8} />
          <Text style={{textAlign: 'center'}}>{t('createWallet.or')}</Text>
          <Spacer times={8} />
          <Text style={[globalStyles.h6, {textAlign: 'center'}]}>{t('submitTree.noOfflineMapToContinue.guide')}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
