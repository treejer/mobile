import {colors} from 'constants/values';
import globalStyles, {fontMedium} from 'constants/styles';

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacityProps,
  TextProps,
  ViewProps,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

export type TButtonProps = {
  testID?: string;
  textAlign?: string;
  size?: 'sm' | 'lg';
  iconPlace?: 'left' | 'right';
  caption: string | null;
  variant?: 'primary' | 'cta' | 'secondary' | 'success' | 'tertiary' | 'fourth';
  icon?: React.ComponentType<any>;
  style?: TouchableOpacityProps['style'];
  textStyle?: TextProps['style'];
  onPress?: () => void;
  round?: boolean;
  loading?: boolean;
} & (
  | (TouchableOpacityProps & {
      disabled?: false;
    })
  | (ViewProps & {
      disabled: true;
    })
);

function Button({
  textAlign,
  size = 'lg',
  iconPlace = 'right',
  caption,
  disabled,
  variant = 'primary',
  icon,
  round,
  style = null,
  textStyle = null,
  loading = false,
  onPress,
  testID,
  ...props
}: TButtonProps) {
  const Component = (disabled ? View : TouchableOpacity) as React.ComponentType<TouchableOpacityProps>;
  return (
    <Component
      testID={testID}
      style={[styles[`${variant}Container`], round ? styles.round : null, style]}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      {icon && iconPlace === 'left' && (
        <View style={[styles[`${variant}IconWrapper`]]}>
          {React.createElement(icon, {
            color: styles[`${variant}Text`].color ?? 'white',
          })}
        </View>
      )}
      {!round && Boolean(caption) ? (
        <Text
          testID={testID ? `${testID}-text` : undefined}
          style={[
            styles[`${variant}Text`],
            textStyle,
            icon ? (iconPlace === 'right' ? styles.hasIconRight : !textAlign ? styles.hasIconLeft : undefined) : {},
            size === 'sm' && styles.smText,
            {textAlign},
          ]}
        >
          {caption}
        </Text>
      ) : null}
      {icon && iconPlace === 'right' && (
        <View style={[styles[`${variant}IconWrapper`]]}>
          {React.createElement(icon, {
            color: styles[`${variant}Text`].color ?? 'white',
          })}
        </View>
      )}
      {loading && (
        <ActivityIndicator
          style={{marginHorizontal: 10}}
          color={styles[`${variant}Text`].color ?? 'white'}
          size="small"
        />
      )}
    </Component>
  );
}

const styles = StyleSheet.create({
  round: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  primaryContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.khakiDark,
    borderRadius: 25,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    flexDirection: 'row',
  },
  primaryText: {
    ...globalStyles.normal,
  },
  ctaContainer: {
    alignItems: 'center',
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
  hasIconRight: {
    paddingRight: 21,
  },
  hasIconLeft: {
    paddingLeft: 16,
    textAlign: 'left',
  },
  secondaryContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.grayDarker,
    borderRadius: 25,
    flexDirection: 'row',
  },
  secondaryText: {
    ...globalStyles.normal,
    color: 'white',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.green,
    borderRadius: 25,
    flexDirection: 'row',
  },
  successText: {
    ...globalStyles.normal,
    color: 'white',
  },
  tertiaryContainer: {
    alignItems: 'center',
    paddingVertical: 12,
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
    flexDirection: 'row',
  },
  tertiaryText: {
    ...fontMedium,
    color: colors.grayDarker,
    fontSize: 16,
    textAlign: 'center',
    flex: 1,
  },
  smText: {
    fontSize: 12,
  },
});

export default Button;
