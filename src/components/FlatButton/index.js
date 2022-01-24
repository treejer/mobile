import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {colors} from '../../constants/values';
import globalStyles from '../../constants/styles';

const FlatButton = ({text, style, primary, onPress}) => {
  return (
    <Text onPress={onPress} style={[styles.flatBtn, primary && styles.primaryColor, style]}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  flatBtn: {
    ...globalStyles.body2,
    color: colors.gray,
  },
  primaryColor: {color: colors.green},
});

export default FlatButton;
