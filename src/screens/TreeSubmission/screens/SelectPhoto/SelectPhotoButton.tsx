import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export interface SelectPhotoButtonPropsType {
  icon?: string;
  onPress: (e?: any) => void;
  caption: string;
}

function SelectPhotoButton(props: SelectPhotoButtonPropsType) {
  const {icon, onPress, caption} = props;

  return (
    <TouchableOpacity style={[styles.button]} onPress={onPress}>
      {icon && <Icon name={icon} size={14} color="white" />}
      <Text style={styles.secondaryText}>{caption}</Text>
    </TouchableOpacity>
  );
}

export default SelectPhotoButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.grayDarker,
    borderRadius: 25,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryText: {
    ...globalStyles.normal,
    color: 'white',
    marginLeft: 8,
  },
});
