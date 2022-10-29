import React, {useCallback, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  Keyboard,
} from 'react-native';
import ModelIcon from 'react-native-vector-icons/FontAwesome';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import Tree from 'components/Icons/Tree';
import {TreeImage} from '../../../assets/icons';

export type TStartPlantButtonProps = {
  onPress: () => void;
  color: string;
  size: 'sm' | 'lg';
  type: 'model' | 'nursery' | 'single';
  hasIcon?: boolean;
  caption?: string;
  containerStyle?: TouchableOpacityProps['style'];
  count?: string | number;
  onFocus?: () => void;
  onBlur?: () => void;
  inputRef?: React.RefObject<TextInput>;
  placeholder?: string;
  onChangeText?: TextInputProps['onChangeText'];
};

export function StartPlantButton(props: TStartPlantButtonProps) {
  const {
    color,
    size,
    caption,
    hasIcon = true,
    type,
    placeholder,
    inputRef,
    onChangeText,
    count,
    containerStyle,
    onPress,
    onFocus,
    onBlur,
  } = props;

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', () => {
      if (inputRef) {
        inputRef?.current?.blur();
      }
    });
  }, []);

  const plantIcon = useCallback(() => {
    const imageSize = {
      height: size === 'lg' ? 54 : 38,
      width: size === 'lg' ? 48 : 26,
    };
    const nurserySize = size === 'lg' ? 24 : 16;
    const modelSize = size === 'lg' ? 48 : 32;
    return type === 'single' ? (
      <Image source={TreeImage} style={{...imageSize, tintColor: color}} />
    ) : type === 'nursery' ? (
      <View style={styles.treesWrapper}>
        <View style={styles.trees}>
          <Tree color={color} size={nurserySize} />
          <Tree color={color} size={nurserySize} />
        </View>
        <Tree color={color} size={nurserySize} />
      </View>
    ) : (
      <ModelIcon name="th" size={modelSize} color={color} />
    );
  }, [type, color]);

  return (
    <TouchableOpacity style={[{borderColor: color}, styles[`${size}PlantType`], containerStyle]} onPress={onPress}>
      {hasIcon && plantIcon()}
      <View style={{flex: 1, paddingHorizontal: size === 'lg' ? 16 : 8}}>
        {type !== 'nursery' ? (
          <Text style={[styles[`${size}Text`], {color: color}]}>{caption}</Text>
        ) : (
          <TextInput
            placeholderTextColor={color}
            placeholder={placeholder}
            style={[styles[`${size}Text`], styles.nurseryInput]}
            onFocus={onFocus}
            onBlur={onBlur}
            blurOnSubmit
            ref={inputRef}
            keyboardType="number-pad"
            value={count?.toString()}
            onChangeText={onChangeText}
            returnKeyType="done"
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  lgPlantType: {
    backgroundColor: colors.khakiDark,
    alignSelf: 'stretch',
    borderStyle: 'solid',
    borderWidth: 1,
    paddingHorizontal: 20,
    height: 80,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  smPlantType: {
    backgroundColor: colors.khakiDark,
    alignSelf: 'stretch',
    borderStyle: 'solid',
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 60,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  treesWrapper: {
    alignItems: 'center',
  },
  trees: {
    flexDirection: 'row',
  },
  lgText: {
    ...globalStyles.h5,
  },
  smText: {
    fontSize: 12,
  },
  nurseryInput: {
    height: '100%',
    width: '100%',
    color: colors.green,
  },
});
