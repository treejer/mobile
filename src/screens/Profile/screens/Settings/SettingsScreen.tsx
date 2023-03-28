import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {NavigationProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {ProfileRouteParamList} from 'types';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import Card from 'components/Card';
import Spacer from 'components/Spacer/Spacer';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {useSettings} from 'ranger-redux/modules/settings/settings';
import {treejerLanguages} from 'utilities/helpers/language';
import {SubmissionSettings} from 'components/SubmissionSettings/SubmissionSettings';

export interface SettingsScreenProps {
  navigation: NavigationProp<ProfileRouteParamList>;
}

export default function SettingsScreen(props: SettingsScreenProps) {
  const {navigation} = props;

  const {locale} = useSettings();
  const {t} = useTranslation();

  const selectedLocale = useMemo(() => treejerLanguages.find(language => language.locale === locale)?.name, [locale]);

  const handleSelectLanguage = () => {
    navigation.navigate('SelectLanguage', {back: true});
  };

  return (
    <SafeAreaView style={[{flex: 1}, globalStyles.screenView]}>
      <ScreenTitle title={t('settings.title')} goBack />
      <View style={[globalStyles.p1, {flex: 1, alignItems: 'center', paddingHorizontal: 16}]}>
        <Card style={styles.btnContainer}>
          <TouchableOpacity style={styles.changeLngBtn} onPress={handleSelectLanguage}>
            <Text style={styles.text}>{t('language')}</Text>
            <Text style={styles.text}>{selectedLocale}</Text>
          </TouchableOpacity>
        </Card>
        <Spacer times={4} />
        <SubmissionSettings />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnContainer: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  changeLngBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    color: colors.grayDarker,
  },
});
