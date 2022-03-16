import React, {useMemo} from 'react';
import {BlockchainNetwork, networks} from 'services/config';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Spacer from 'components/Spacer/Spacer';
import {useTranslation} from 'react-i18next';
import {colors} from 'constants/values';
import globalStyles from 'constants/styles';

export interface ConfirmationNetworkProps {
  network: BlockchainNetwork;
  onConfirm: (network: BlockchainNetwork) => void;
  onDismiss: () => void;
}

export function ConfirmationNetwork(props: ConfirmationNetworkProps) {
  const {network, onConfirm, onDismiss} = props;

  const {t} = useTranslation();

  const networkInfos = useMemo(() => networks[network], [network]);

  return (
    <View style={{flex: 1}}>
      <View style={{width: '100%', backgroundColor: 'white', alignItems: 'center', borderRadius: 8}}>
        <Image source={networkInfos.logo} style={{height: 100, width: '85%'}} />
      </View>
      <Spacer times={4} />
      <Text style={[{alignSelf: 'center'}, globalStyles.h5]}>{networkInfos.title}</Text>
      <Spacer times={4} />
      <Text style={[globalStyles.h6, {alignSelf: 'center', color: colors.grayDarker}]}>{networkInfos.details}</Text>
      <Spacer times={4} />
      <Text style={[globalStyles.h6, {alignSelf: 'center', color: colors.red}]}>{t('networks.restartApp')}</Text>
      <Spacer times={4} />
      <Text style={[globalStyles.h4, {alignSelf: 'center'}]}>{t('networks.areYouSure')}</Text>
      <Spacer times={2} />
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => onConfirm(network)}
          style={[styles.button, {backgroundColor: colors.grayDarker}]}
        >
          <Text style={{color: colors.khaki}}>{t('networks.yes')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDismiss()} style={[styles.button, {backgroundColor: colors.red}]}>
          <Text style={{color: colors.khaki}}>{t('networks.no')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 32,
  },
});
