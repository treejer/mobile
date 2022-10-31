import React, {useMemo} from 'react';
import {ActivityIndicator, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {NavigationProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Octicons';
import Web3 from 'web3';

import {ProfileRouteParamList} from 'types';
import {isMatic} from 'services/Magic';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import Card from 'components/Card';
import Spacer from 'components/Spacer/Spacer';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {useConfig} from '../../../../redux/modules/web3/web3';
import {useSettings} from '../../../../redux/modules/settings/settings';
import {useContracts} from '../../../../redux/modules/contracts/contracts';
import {languages, treejerLanguages} from 'utilities/helpers/language';

export interface SettingsScreenProps {
  navigation: NavigationProp<ProfileRouteParamList>;
}

export default function SettingsScreen(props: SettingsScreenProps) {
  const {navigation} = props;

  const config = useConfig();
  const {ether} = useContracts();
  const {locale, useGSN, checkMetaData, changeUseGSN, changeCheckMetaData} = useSettings();
  const {t} = useTranslation();

  console.log(useGSN, 'useGsn');
  console.log(checkMetaData, 'checkMetaData');

  const etherBalance = useMemo(() => Web3.utils.fromWei(ether), [ether]);

  const selectedLocale = useMemo(() => treejerLanguages.find(language => language.locale === locale)?.name, [locale]);

  const handleSelectLanguage = () => {
    navigation.navigate('SelectLanguage', {back: true});
  };

  const handleChangeUseGSN = value => {
    changeUseGSN(value);
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
        <Card>
          <View style={styles.settingsItem}>
            <Text style={styles.text}>{t('settings.useGSN')}</Text>
            <Switch value={useGSN} onValueChange={handleChangeUseGSN} />
          </View>
          <View style={{paddingVertical: 16}}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Icon name="note" size={20} style={{marginVertical: 2}} color={colors.red} />
              <Text style={{textAlign: 'justify', paddingHorizontal: 8, color: colors.red}}>
                {t('settings.gsnDetails')}
              </Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8}}
          >
            <Text style={styles.text}>{t(isMatic(config) ? 'settings.maticBalance' : 'settings.ethBalance')}</Text>
            {etherBalance ? (
              <Text style={styles.text}>{Number(etherBalance).toFixed(etherBalance ? 7 : 0)}</Text>
            ) : (
              <ActivityIndicator color={colors.gray} />
            )}
          </View>
          {!config.isMainnet && (
            <>
              <Spacer />
              <View style={styles.settingsItem}>
                <Text style={styles.text}>{t('settings.checkMetaData')}</Text>
                <Switch value={checkMetaData} onValueChange={changeCheckMetaData} />
              </View>
            </>
          )}
        </Card>
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
