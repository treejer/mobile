import React, {useMemo} from 'react';
import {Image, Text, TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {BlockchainNetwork, networks} from 'services/config';

export type NetworkItemProps = {
  network: BlockchainNetwork;
} & TouchableOpacityProps;

export function NetworkItem(props: NetworkItemProps) {
  const {network, ...restProps} = props;

  const networkInfo = useMemo(() => networks[network], [network]);

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
    >
      <Image source={networkInfo.logo} style={{width: '30%', height: 40}} />
      <Text>{networkInfo.title}</Text>
    </TouchableOpacity>
  );
}
