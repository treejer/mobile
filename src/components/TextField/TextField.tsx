import globalStyles, {fontNormal} from 'constants/styles';
import {colors} from 'constants/values';

import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';
import {Controller, Control, ValidationRule, FieldError} from 'react-hook-form';
import PhoneInput, {PhoneInputProps} from 'react-native-phone-number-input';

type OwnProps = {
  defaultValue?: string;
  rules?: ValidationRule | any;
  success?: boolean;
  error?: FieldError;
  disabled?: boolean;
  name: string;
} & (
  | {
      control: Control<any>;
      name: string;
    }
  | {
      control?: undefined;
      name?: undefined;
    }
);

type TextFieldProps = TextInputProps & OwnProps;
type PhoneFieldProps = PhoneInputProps & OwnProps & TextInputProps;

const TextField = React.forwardRef<TextInput, TextFieldProps>(
  ({control, name, rules, defaultValue = '', success, error, ...props}: TextFieldProps, ref) => {
    const inputProps = {
      ...props,
      ref,
      style: [styles.wrapper, success && styles.success, error && styles.error, props.style],
    };

    if (control) {
      return (
        <View style={styles.inputWrapper}>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                {...inputProps}
                onBlur={onBlur}
                onChangeText={inputValue => onChange(inputValue)}
                value={value}
              />
            )}
            name={name}
            rules={rules}
            defaultValue={defaultValue}
          />
          {error?.message ? <Text style={[globalStyles.small, styles.errorText]}>{error.message}</Text> : null}
        </View>
      );
    }

    return <TextInput {...inputProps} />;
  },
);

TextField.displayName = 'TextField';

export const PhoneField = React.forwardRef<PhoneInput, PhoneFieldProps>(
  ({control, name, rules, defaultValue = '', success, error, containerStyle, ...props}: PhoneFieldProps, ref) => {
    const inputProps = {
      ...props,
      ref,
    };

    if (control) {
      return (
        <View style={styles.inputWrapper}>
          <Controller
            control={control}
            render={({field: {onBlur, onChange, value}}) => (
              <PhoneInput
                {...inputProps}
                textInputProps={{onBlur}}
                flagButtonStyle={styles.flagButton}
                containerStyle={[
                  styles.phoneContainer,
                  success && styles.success,
                  error && styles.error,
                  containerStyle,
                ]}
                textContainerStyle={[styles.wrapper, styles.phoneInputContainer, {width: '100%', paddingVertical: 0}]}
                codeTextStyle={{height: 25, padding: 0, textAlign: 'right'}}
                onChangeText={inputValue => onChange(inputValue)}
                value={value}
              />
            )}
            name={name}
            rules={rules}
            defaultValue={defaultValue}
          />
          {error?.message ? <Text style={[globalStyles.small, styles.errorText]}>{error.message}</Text> : null}
        </View>
      );
    }

    return <PhoneInput {...inputProps} />;
  },
);

PhoneField.displayName = 'PhoneField';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.khakiDark,
    height: 40,
    minWidth: 100,
    borderRadius: 6,
    paddingLeft: 23,
    ...fontNormal,
  },
  success: {
    borderWidth: 1,
    borderColor: colors.green,
  },
  error: {
    borderWidth: 1,
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    marginTop: 8,
  },
  // Phone styles
  flagButton: {
    backgroundColor: colors.khakiDark,
    width: 70,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  phoneInputContainer: {
    width: 50,
    minWidth: 10,
    paddingLeft: 5,
    borderRadius: 0,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  phoneContainer: {
    minWidth: 100,
    width: 240,
    borderRadius: 6,
    backgroundColor: colors.khakiDark,
    alignItems: 'center',
  },
  inputWrapper: {
    alignSelf: 'stretch',
  },
});

export default TextField;
