import globalStyles, {fontMedium} from 'constants/styles';
import {colors} from 'constants/values';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

interface FileInputPropsType {
  icon?: string;
  onPress: (e?: any) => void;
  caption: string;
  style?: React.CSSProperties;
}

function FileInput(props: FileInputPropsType) {
  const {onPress, caption, icon} = props;
  return (
    <label
      style={{
        padding: '8px 20px',
        backgroundColor: colors.grayDarker,
        borderRadius: 25,
        marginLeft: 8,
        cursor: 'pointer',
      }}
      htmlFor="inputFile"
    >
      {icon && <Icon name={icon} size={14} color="white" />}
      <Text style={styles.secondaryText}>{caption}</Text>
      <input style={{display: 'none'}} type="file" id="inputFile" accept="image/png, image/jpeg" onChange={onPress} />
    </label>
  );
}

export default FileInput;

const styles = StyleSheet.create({
  secondaryText: {
    ...globalStyles.normal,
    color: 'white',
    marginLeft: 8,
  },
});
