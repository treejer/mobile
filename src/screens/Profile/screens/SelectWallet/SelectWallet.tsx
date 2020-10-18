import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
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
