import React, {useMemo} from 'react';
import {ActivityIndicator, Dimensions, Switch, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {NavigationProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Octicons';
import Web3 from 'web3';

import Button from 'components/Button';
import {ChevronLeft} from 'components/Icons';
import Spacer from 'components/Spacer/Spacer';
import {useSettings} from 'utilities/hooks/useSettings';
import {useConfig} from 'utilities/hooks/useWeb3';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {isMatic} from 'services/Magic';
import {ProfileRouteParamList} from 'types';
import {useContracts} from '../../../../redux/modules/contracts/contracts';

export interface SettingsScreenProps {
  navigation: NavigationProp<ProfileRouteParamList>;
}

const {width} = Dimensions.get('window');

export default function SettingsScreen(props: SettingsScreenProps) {
  const {navigation} = props;

  const config = useConfig();
  const {ether} = useContracts();
  const {useGSN, changeUseGSN} = useSettings();

  console.log(useGSN, 'useGsn');

  const {t} = useTranslation();

  const etherBalance = useMemo(() => Web3.utils.fromWei(ether), [ether]);

  const handleSelectLanguage = () => {
    navigation.navigate('SelectLanguage', {back: true});
  };

  const handleChangeUseGSN = value => {
    changeUseGSN(value);
  };

  return (
    <SafeAreaView style={[{flex: 1}, globalStyles.screenView, globalStyles.p1]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity style={[globalStyles.p1]} onPress={() => navigation.goBack()}>
          <ChevronLeft />
        </TouchableOpacity>
        <Text style={[globalStyles.h5, globalStyles.textCenter, {marginHorizontal: 24}]}>{t('settings.title')}</Text>
      </View>
      <Spacer times={4} />
      <View style={{flex: 1, alignItems: 'center', paddingHorizontal: 16}}>
        <Button style={{width: '100%'}} caption={t('language')} variant="tertiary" onPress={handleSelectLanguage} />
        <Spacer times={4} />
        <View
          style={{
            backgroundColor: 'white',
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
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text>{t('settings.useGSN')}</Text>
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
            <Text>{t(isMatic(config) ? 'settings.maticBalance' : 'settings.ethBalance')}</Text>
            {etherBalance ? (
              <Text>{Number(etherBalance).toFixed(etherBalance ? 7 : 0)}</Text>
            ) : (
              <ActivityIndicator color={colors.gray} />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
