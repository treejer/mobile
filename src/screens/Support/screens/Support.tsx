import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

import Spacer from 'components/Spacer';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {SupportItem} from 'screens/Support/components/SupportItem';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';

export const supportsList = [
  {
    name: 'chatOnline',
    icon: 'rocketchat',
    color: colors.grayDarker,
    link: '',
  },
  {
    name: 'discord',
    icon: 'discord',
    color: '#7289DA',
    link: '',
  },
  {
    name: 'twitter',
    icon: 'twitter-square',
    color: '#1DA1F2',
    link: '',
  },
];

export function Support() {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={globalStyles.fill}>
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
