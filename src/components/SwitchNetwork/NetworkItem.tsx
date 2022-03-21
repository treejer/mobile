import React, {useMemo} from 'react';
import {Image, Text, TouchableOpacity, TouchableOpacityProps, View} from 'react-native';
import {BlockchainNetwork, networks} from 'services/config';
import {colors} from 'constants/values';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Spacer from 'components/Spacer/Spacer';

export type NetworkItemProps = {
  network: BlockchainNetwork;
  activeNetwork: BlockchainNetwork;
} & TouchableOpacityProps;

export function NetworkItem(props: NetworkItemProps) {
  const {network, activeNetwork, ...restProps} = props;

  const networkInfo = useMemo(() => networks[network], [network]);
  const isActive = useMemo(() => network === activeNetwork, []);

  return (
    <TouchableOpacity
      {...restProps}
      style={{
        padding: 12,
        backgroundColor: 'white',
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderRadius: 4,
      }}
      disabled={isActive}
    >
      <Image source={networkInfo.logo} style={{width: '30%', height: 40}} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{color: isActive ? colors.green : colors.grayLight, fontWeight: isActive ? 'bold' : 'normal'}}>
          {networkInfo.title}
        </Text>
        <Spacer times={2} />
        {isActive && <MaterialIcons name="check-circle" color={colors.green} size={24} />}
      </View>
    </TouchableOpacity>
  );
}
