import React from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import {Controller, Control, ValidationRules, FieldError} from 'react-hook-form';
import {fontNormal} from 'constants/styles';
import {colors} from 'constants/values';

type Props = TextInputProps & {
  defaultValue?: string;
  rules?: ValidationRules;
  success?: boolean;
  error?: FieldError;
} & (
    | {
        control: Control;
        name: string;
      }
    | {
        control?: undefined;
        name?: undefined;
      }
  );

const TextField = React.forwardRef(
  ({control, name, rules, defaultValue = '', success, error, ...props}: Props, ref) => {
    const inputProps = {
      ...props,
      ref: ref as any,
      style: [styles.wrapper, success && styles.success, error && styles.error, props.style],
    };

    if (control) {
      return (
        <Controller
          control={control}
          render={({onChange, onBlur, value}) => (
            <TextInput {...inputProps} onBlur={onBlur} onChangeText={value => onChange(value)} value={value} />
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
});

export default TextField;
