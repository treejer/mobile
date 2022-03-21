import globalStyles from 'constants/styles';

import React, {useMemo} from 'react';
import {View, Text, Image, Alert} from 'react-native';
import BackgroundEntropy from 'components/BackgroundEntropy';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {useSettings} from 'services/settings';
import {useAnalytics} from 'utilities/hooks/useAnalytics';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {ProfileRouteParamList} from 'types';
import AppVersion from 'components/AppVersion';
import {isWeb} from 'utilities/helpers/web';

export interface SelectLanguageProps {
  route?: RouteProp<ProfileRouteParamList, 'SelectLanguage'>;
  navigation?: NavigationProp<ProfileRouteParamList>;
}

function SelectLanguage(props: SelectLanguageProps) {
  const {route, navigation} = props;
  const settings = useSettings();

  const {sendEvent} = useAnalytics();

  const handleChangeLanguage = (locale: string) => {
    if (locale !== 'en') {
      Alert.alert('Coming Soon', 'Temporary setting language to English');
    }
    settings.updateLocale('en');
    sendEvent('choose_language');
    if (route?.params?.back) {
      navigation.goBack();
    }
  };

  const imageStyle = useMemo(() => {
    return isWeb() ? {height: 200} : {};
  }, []);

  return (
    <View style={globalStyles.fill}>
      <BackgroundEntropy />
      <View style={[globalStyles.alignItemsCenter, globalStyles.justifyContentCenter, globalStyles.fill]}>
        <Text style={[globalStyles.h2, globalStyles.textCenter]}>TREEJER{'\n'}RANGER APP</Text>
        <AppVersion style={globalStyles.mb1} />
        <Image source={require('../../../../../assets/images/welcome.png')} style={imageStyle} />
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
  );
}

export default SelectLanguage;
