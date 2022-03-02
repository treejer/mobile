import React, {useMemo} from 'react';
import {Dimensions, Switch, Text, View} from 'react-native';
import Button from 'components/Button';
import {useTranslation} from 'react-i18next';
import {ProfileRouteParamList} from 'types';
import {NavigationProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import globalStyles from 'constants/styles';
import Spacer from 'components/Spacer/Spacer';
import {useSettings} from 'services/settings';

export interface SettingsScreenProps {
  navigation: NavigationProp<ProfileRouteParamList>;
}

const {width} = Dimensions.get('window');

export default function SettingsScreen(props: SettingsScreenProps) {
  const {navigation} = props;

  const {useGSN, setUseGSN} = useSettings();

  const fullWidth = useMemo(() => width - 80, []);
  const {t} = useTranslation();

  const handleSelectLanguage = () => {
    navigation.navigate('SelectLanguage', {back: true});
  };

  const handleChangeUseGSN = value => {
    setUseGSN(value);
  };

  return (
    <SafeAreaView style={{flex: 1, ...globalStyles.screenView, ...globalStyles.p1}}>
      <Text style={[globalStyles.h3, globalStyles.textCenter]}>{t('settings.title')}</Text>
      <Spacer times={4} />
      <View style={{flex: 1, alignItems: 'center'}}>
        <Button style={{width: fullWidth}} caption={t('language')} variant="tertiary" onPress={handleSelectLanguage} />
        <Spacer times={4} />
        <View
          style={{
            backgroundColor: 'white',
            width: fullWidth,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 10,
            shadowOffset: {
              width: 2,
              height: 6,
            },
            shadowRadius: 20,
            shadowColor: 'black',
            shadowOpacity: 0.15,
            elevation: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text>{t('settings.useGSN')}</Text>
          <Switch value={useGSN} onValueChange={handleChangeUseGSN} />
        </View>
      </View>
    </SafeAreaView>
  );
}
