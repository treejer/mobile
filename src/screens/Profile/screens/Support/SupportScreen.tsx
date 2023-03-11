import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

import Spacer from 'components/Spacer';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {SupportItem} from 'screens/Profile/components/SupportItem';
import globalStyles from 'constants/styles';
import {supportsList} from 'screens/Profile/components/supportList';

export function SupportScreen() {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <View style={[globalStyles.fill, globalStyles.screenView]}>
        <ScreenTitle goBack title={t('support')} />
        <Spacer times={3} />
        <View style={[globalStyles.alignItemsCenter]}>
          {supportsList.map(support => (
            <SupportItem key={support.name} support={support} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
