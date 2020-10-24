import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import globalStyles from 'constants/styles';

interface Props {}

function SelectWallet(props: Props) {
  const navigation = useNavigation();
  return (
    <View style={globalStyles.screenView}>
      <Text>asdasdj</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  signInText: {
    color: '#67B68C',
  },
  buttonsWrapper: {
    width: 200,
  },
});

export default SelectWallet;
