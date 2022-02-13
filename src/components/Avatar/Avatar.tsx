import {colors} from 'constants/values';

import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {useWalletAccount} from 'services/web3';

interface Props {
  size?: number;
  type?: 'active' | 'inactive';
  address?: string;
}

const BORDER_WIDTH = 2.5;
const BORDER_GAP = 2;
const SIZE_OFFSET = (BORDER_WIDTH + BORDER_GAP) * 2;

function Avatar({size = 64, address, type}: Props) {
  const account = useWalletAccount();
  const imageSize = size - SIZE_OFFSET;
  const borderRadius = Math.ceil(size / 2);
  const imageBorderRadius = Math.ceil(imageSize / 2);
  const uri = `https://avatars.treejer.com/${(address || account || '0000').toLowerCase()}`;

  return (
    <View style={[{width: size, height: size, borderRadius}, styles.container, type && styles[`${type}Container`]]}>
      <Image
        style={{
          width: imageSize,
          height: imageSize,
          borderRadius: imageBorderRadius,
        }}
        source={{uri}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BORDER_WIDTH,
    borderColor: 'transparent',
  },
  activeContainer: {
    borderColor: colors.green,
  },
  inactiveContainer: {
    borderColor: colors.red,
  },
});

export default Avatar;
