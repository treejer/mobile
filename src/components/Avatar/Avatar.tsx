import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, ActivityIndicator} from 'react-native';

import {colors} from 'constants/values';
import {useConfig, useWalletAccount} from 'ranger-redux/modules/web3/web3';

interface Props {
  size?: number;
  type?: 'active' | 'inactive';
}

const BORDER_WIDTH = 2.5;
const BORDER_GAP = 2;
const SIZE_OFFSET = (BORDER_WIDTH + BORDER_GAP) * 2;

function Avatar({size = 64, type}: Props) {
  const [uri, setUri] = useState('');

  const config = useConfig();
  const account = useWalletAccount();

  useEffect(() => {
    setUri(`${config.avatarBaseUrl}/${account ? account.toLowerCase() : 'null'}`);
  }, [account, config.avatarBaseUrl]);

  const imageSize = size - SIZE_OFFSET;
  const borderRadius = Math.ceil(size / 2);
  const imageBorderRadius = Math.ceil(imageSize / 2);

  return (
    <View style={[{width: size, height: size, borderRadius}, styles.container, type && styles[`${type}Container`]]}>
      {uri ? (
        <Image
          style={{
            width: imageSize,
            height: imageSize,
            borderRadius: imageBorderRadius,
          }}
          source={{uri}}
        />
      ) : (
        <ActivityIndicator color={colors.green} />
      )}
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
