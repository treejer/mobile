import Button from 'components/Button';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View, TouchableOpacity, Linking} from 'react-native';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ChevronLeft} from 'components/Icons';
import {useBrowserPlatform} from '../../../../utilities/hooks/useBrowserPlatform';

export default function OfflineMap({navigation}) {
  const {t} = useTranslation();
  const browserPlatform = useBrowserPlatform();

  const pushToStoreHandler = useCallback(() => {
    let href = 'https://play.google.com/store/apps/details?id=com.treejer.ranger';
    if (browserPlatform === 'iOS') {
      href = 'https://apple.com';
    }

    Linking.openURL(href);
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: colors.khaki, flex: 1}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          style={[globalStyles.pv1, globalStyles.pr1, {padding: 20}]}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft />
        </TouchableOpacity>
        <Text style={[globalStyles.h5, globalStyles.textCenter, {marginHorizontal: 24}]}>
          {t('offlineMap.downloadArea')}
        </Text>
      </View>

      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{marginBottom: 10}}>{t('offlineMap.notSupported')}</Text>

        <Button caption={t('offlineMap.downloadApplication')} onPress={pushToStoreHandler} />
      </View>
    </SafeAreaView>
  );
}
