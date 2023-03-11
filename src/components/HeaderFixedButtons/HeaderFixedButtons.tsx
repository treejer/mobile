import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import NetInfo from 'components/NetInfo';
import {SwitchNetwork} from 'components/SwitchNetwork/SwitchNetwork';
import Spacer from 'components/Spacer';
import {ChatButton} from 'components/HeaderFixedButtons/ChatButton';

export function HeaderFixedButtons() {
  const {top, right} = useSafeAreaInsets();

  return (
    <View style={[styles.container, {top: top + 4, right: right + 4}]}>
      <Spacer times={1} />
      <ChatButton />
      <Spacer times={1} />
      <SwitchNetwork />
      <Spacer times={1} />
      <NetInfo />
      <Spacer times={1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    position: 'absolute',
    zIndex: 9,
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
});
