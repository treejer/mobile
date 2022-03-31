import {fontNormal} from 'constants/styles';
import {colors} from 'constants/values';

import React from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';
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
        <Controller
          control={control}
          render={({field: {onBlur, onChange, value}}) => (
            <PhoneInput
              {...inputProps}
              textInputProps={{onBlur}}
              flagButtonStyle={styles.flagButton}
              containerStyle={[styles.phoneContainer, containerStyle]}
              textContainerStyle={[
                styles.wrapper,
                styles.phoneInputContainer,
                success && styles.success,
                error && styles.error,
                {width: '100%'},
              ]}
              codeTextStyle={{height: 25, padding: 0, textAlign: 'right'}}
              onChangeText={inputValue => onChange(inputValue)}
              value={value}
            />
          )}
          name={name}
          rules={rules}
          defaultValue={defaultValue}
        />
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
  },
});

export default TextField;
