import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, Dimensions, Switch, Text, View} from 'react-native';
import Button from 'components/Button';
import {useTranslation} from 'react-i18next';
import {ProfileRouteParamList} from 'types';
import {NavigationProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import globalStyles from 'constants/styles';
import Spacer from 'components/Spacer/Spacer';
import {useSettings} from 'services/settings';
import Icon from 'react-native-vector-icons/Octicons';
import {colors} from 'constants/values';
import {useWalletAccount, useWeb3} from 'services/web3';

export interface SettingsScreenProps {
  navigation: NavigationProp<ProfileRouteParamList>;
}

const {width} = Dimensions.get('window');

export default function SettingsScreen(props: SettingsScreenProps) {
  const {navigation} = props;

  const [ether, setEther] = useState<string>('');

  const {useGSN, changeUseGsn} = useSettings();
  const web3 = useWeb3();
  const walletAccount = useWalletAccount();

  console.log(useGSN, 'useGsn');

  const fullWidth = useMemo(() => width - 80, []);
  const {t} = useTranslation();

  const handleSelectLanguage = () => {
    navigation.navigate('SelectLanguage', {back: true});
  };

  const handleChangeUseGSN = value => {
    changeUseGsn(value);
  };

  useEffect(() => {
    (async () => {
      try {
        const balance = await web3.eth.getBalance(walletAccount);
        const _balance = web3.utils.fromWei(balance);
        setEther(_balance);
      } catch (e) {
        console.log(e, 'e inside getBalance');
      }
    })();
  }, []);

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
            <Text>{t('settings.ethBalance')}</Text>
            {ether ? <Text>{Number(ether).toFixed(7)}</Text> : <ActivityIndicator color={colors.gray} />}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
