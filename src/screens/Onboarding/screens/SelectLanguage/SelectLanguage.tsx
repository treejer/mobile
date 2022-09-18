import globalStyles from 'constants/styles';

import React, {useMemo} from 'react';
import {Image, Text, View} from 'react-native';
import BackgroundEntropy from 'components/BackgroundEntropy';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {useSettings} from 'utilities/hooks/useSettings';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import AppVersion from 'components/AppVersion';
import {isWeb} from 'utilities/helpers/web';
import {RootNavigationProp, Routes} from 'navigation';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Welcome} from '../../../../../assets/images';

export type SelectLanguageProps = RootNavigationProp<Routes.SelectLanguage>;

function SelectLanguage(props: SelectLanguageProps) {
  const {route, navigation} = props;
  const settings = useSettings();

  const {sendEvent} = useAnalytics();

  const {t} = useTranslation();

  const handleChangeLanguage = (locale: string) => {
    if (locale !== 'en') {
      showAlert({
        title: t('comingSoon'),
        message: t('tempLangEnglish'),
        mode: AlertMode.Info,
      });
    }
    settings.updateLocale('en');
    sendEvent('choose_language');
    if (route?.params?.back) {
      navigation.goBack();
    }
  };

  const imageStyle = useMemo(() => {
    return isWeb() ? {height: 200, width: 200} : {};
  }, []);

  return (
    <SafeAreaView style={[globalStyles.fill, globalStyles.screenView]}>
      <View style={globalStyles.fill}>
        <BackgroundEntropy />
        <View style={[globalStyles.alignItemsCenter, globalStyles.justifyContentCenter, globalStyles.fill]}>
          <Text style={[globalStyles.h2, globalStyles.textCenter]}>TREEJER{'\n'}RANGER APP</Text>
          <AppVersion style={globalStyles.mb1} />
          <Image source={Welcome} style={imageStyle} />
          <Text style={[globalStyles.h4, globalStyles.textCenter]}>Choose language</Text>
          <View style={[globalStyles.horizontalStack, globalStyles.ph1, globalStyles.pt1]}>
            <Button
              caption="English"
              onPress={() => {
                handleChangeLanguage('en');
              }}
            />
            <Spacer />
            <Button
              caption="Français"
              onPress={() => {
                handleChangeLanguage('fr');
              }}
            />
            <Spacer />
            <Button
              caption="فارسی"
              onPress={() => {
                handleChangeLanguage('fa');
              }}
            />
          </View>
          <View style={[globalStyles.horizontalStack, globalStyles.ph1, globalStyles.pt1]}>
            <Button
              caption="Español"
              onPress={() => {
                handleChangeLanguage('es');
              }}
            />
            <Spacer />
            <Button
              caption="Turkish"
              onPress={() => {
                handleChangeLanguage('tr');
              }}
            />
            <Spacer />
            <Button
              caption="العربيه"
              onPress={() => {
                handleChangeLanguage('ar');
              }}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default SelectLanguage;
