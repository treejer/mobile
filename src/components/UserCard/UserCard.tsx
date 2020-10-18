import React from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import Avatar from '../Avatar';
import globalStyles from 'constants/styles';

interface Props {
  name: string;
  text: string;
}

function UserCard({name, text}: Props) {
  return (
    <TouchableOpacity style={[styles.container, globalStyles.horizontalStack]}>
      <Avatar type="active" size={48} />
      <View style={[globalStyles.fill, globalStyles.pl1, styles.textWrapper]}>
        <Text style={globalStyles.h6}>{name}</Text>
        <Text style={globalStyles.body1}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowOffset: {
      width: 2,
      height: 6,
    },
    shadowRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  textWrapper: {
    justifyContent: 'space-evenly',
  },
});

export default UserCard;
