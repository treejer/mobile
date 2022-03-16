import React, {useMemo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import globalStyles from 'constants/styles';
import {NetworkItem} from 'components/SwitchNetwork/NetworkItem';
import {BlockchainNetwork} from 'services/config';
import {useTranslation} from 'react-i18next';
import Spacer from 'components/Spacer/Spacer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors} from 'constants/values';

export interface SelectNetworkProps {
  handleSelectNetwork: (network: BlockchainNetwork) => void;
  activeNetwork: BlockchainNetwork;
  handleCloseModal: () => void;
}

export function SelectNetwork(props: SelectNetworkProps) {
  const {handleSelectNetwork, activeNetwork, handleCloseModal} = props;

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
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12}}>
        <Text style={[globalStyles.h5]}>{t('networks.selectNetwork')}</Text>
        <TouchableOpacity onPress={handleCloseModal}>
          <MaterialIcons name="close" size={20} color={colors.grayDarker} />
        </TouchableOpacity>
      </View>
      <Text style={[globalStyles.h6]}>{t('networks.mainTitle')}</Text>
      <Spacer times={4} />
      {networks.main.map(network => (
        <NetworkItem
          activeNetwork={activeNetwork}
          key={network}
          network={network}
          onPress={() => handleSelectNetwork(network)}
        />
      ))}
      <Text style={[globalStyles.h6]}>{t('networks.testTitle')}</Text>
      <Spacer times={4} />
      {networks.test.map(network => (
        <NetworkItem
          activeNetwork={activeNetwork}
          key={network}
          network={network}
          onPress={() => handleSelectNetwork(network)}
        />
      ))}
    </View>
  );
}
