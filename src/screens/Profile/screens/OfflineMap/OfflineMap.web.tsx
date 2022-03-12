import Button from 'components/Button';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, View, TouchableOpacity} from 'react-native';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ChevronLeft} from 'components/Icons';

export default function OfflineMap({navigation}) {
  const {t} = useTranslation();

  const isIos = useMemo(() => /webOS|iPhone|iPad|iPod/i.test(navigator.userAgent), []);
  const href = useMemo(() => {
    let linkHref = 'https://play.google.com';
    if (isIos) {
      linkHref = 'https://apple.com';
    }
    return linkHref;
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

        <a href={href} target="_blank" rel="nofollow noreferrer">
          <Button caption={t('offlineMap.downloadApplication')} />
        </a>
      </View>
    </SafeAreaView>
  );
}
