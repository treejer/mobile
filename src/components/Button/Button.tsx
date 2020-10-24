import React from 'react';
import {StyleSheet, Text, View, TouchableOpacityProps, TextProps, ViewProps} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {colors} from 'constants/values';
import globalStyles, {fontMedium} from 'constants/styles';

type Props = {
  caption: string;
  variant?: 'primary' | 'cta' | 'secondary' | 'success' | 'tertiary';
  icon?: React.ComponentType<any>;
  style?: TouchableOpacityProps['style'];
  textStyle?: TextProps['style'];
  onPress?: () => void;
} & (
  | (TouchableOpacityProps & {
      disabled?: false;
    })
  | (ViewProps & {
      disabled: true;
    })
);

function Button({
  caption,
  disabled,
  variant = 'primary',
  icon,
  style = null,
  textStyle = null,
  onPress,
  ...props
}: Props) {
  const Component = (disabled ? View : TouchableOpacity) as React.ComponentType<TouchableOpacityProps>;
  return (
    <Component style={[styles[`${variant}Container`], style]} onPress={onPress} {...props}>
      <Text style={[styles[`${variant}Text`], textStyle, icon ? styles.hasIcon : {}]}>{caption}</Text>
      {icon && (
        <View style={[styles[`${variant}IconWrapper`]]}>
          {React.createElement(icon, {
            color: 'white',
          })}
        </View>
      )}
    </Component>
  );
}

const styles = StyleSheet.create({
  primaryContainer: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.khakiDark,
    borderRadius: 25,
    borderColor: '#BDBDBD',
    borderWidth: 1,
  },
  primaryText: {
    ...globalStyles.normal,
  },
  ctaContainer: {
    paddingVertical: 12,
    paddingHorizontal: 29,
    backgroundColor: 'white',
    borderRadius: 32,
    shadowOffset: {
      width: 2,
      height: 6,
    },
    shadowRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    elevation: 7,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ctaText: {
    color: colors.grayDarker,
  },
  ctaIconWrapper: {
    backgroundColor: colors.green,
    alignSelf: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -24,
    marginBottom: -10,
    marginTop: -10,
  },
  hasIcon: {
    paddingRight: 21,
  },
  secondaryContainer: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.grayDarker,
    borderRadius: 25,
  },
  secondaryText: {
    ...globalStyles.normal,
    color: 'white',
  },
  successContainer: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.green,
    borderRadius: 25,
  },
  successText: {
    ...globalStyles.normal,
    color: 'white',
  },
  tertiaryContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowOffset: {
      width: 2,
      height: 6,
    },
    shadowRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    elevation: 6,
  },
  tertiaryText: {
    ...fontMedium,
    color: colors.grayDarker,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Button;
