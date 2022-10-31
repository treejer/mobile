import React, {useMemo} from 'react';
import {Image, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

import {RootNavigationProp, Routes} from 'navigation';
import Button from 'components/Button';
import AppVersion from 'components/AppVersion';
import BackgroundEntropy from 'components/BackgroundEntropy';
import {isWeb} from 'utilities/helpers/web';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import globalStyles from 'constants/styles';
import {useSettings} from '../../../../redux/modules/settings/settings';
import {Welcome} from '../../../../../assets/images';
import {treejerLanguages} from 'utilities/helpers/language';

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
          <View
            style={[
              globalStyles.horizontalStack,
              globalStyles.ph1,
              globalStyles.pt1,
              globalStyles.justifyContentCenter,
              globalStyles.alignItemsCenter,
              globalStyles.flexWrap,
            ]}
          >
            {treejerLanguages.map(lang => (
              <View style={{margin: 4}}>
                <Button
                  caption={lang.name}
                  onPress={() => {
                    handleChangeLanguage(lang.locale);
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default SelectLanguage;
