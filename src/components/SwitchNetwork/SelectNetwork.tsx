import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import globalStyles from 'constants/styles';
import {NetworkItem} from 'components/SwitchNetwork/NetworkItem';
import {BlockchainNetwork} from 'services/config';
import {useTranslation} from 'react-i18next';
import Spacer from 'components/Spacer/Spacer';

export interface SelectNetworkProps {
  handleSelectNetwork: (network: BlockchainNetwork) => void;
}

export function SelectNetwork(props: SelectNetworkProps) {
  const {handleSelectNetwork} = props;

  const {t} = useTranslation();

  const networks = useMemo(
    () => ({
      test: [BlockchainNetwork.Rinkeby, BlockchainNetwork.MaticTest],
      main: [BlockchainNetwork.MaticMain],
    }),
    [],
  );

  return (
    <View style={{flex: 1}}>
      <Text style={[globalStyles.h5, {marginBottom: 12}]}>{t('networks.selectNetwork')}</Text>
      <Text style={[globalStyles.h6]}>{t('networks.testTitle')}</Text>
      <Spacer times={4} />
      {networks.test.map(network => (
        <NetworkItem key={network} network={network} onPress={() => handleSelectNetwork(network)} />
      ))}
      <Text style={[globalStyles.h6]}>{t('networks.mainTitle')}</Text>
      <Spacer times={4} />
      {networks.main.map(network => (
        <NetworkItem key={network} network={network} onPress={() => handleSelectNetwork(network)} />
      ))}
    </View>
  );
}
