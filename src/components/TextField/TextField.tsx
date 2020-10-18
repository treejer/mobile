import React from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import {Controller, Control, ValidationRules} from 'react-hook-form';
import {fontNormal} from 'constants/styles';
import {colors} from 'constants/values';

interface Props extends TextInputProps {
  control: Control;
  name: string;
  defaultValue?: string;
  rules?: ValidationRules;
  success?: boolean;
}

const TextField = React.forwardRef(({control, name, rules, defaultValue = '', success, ...props}: Props, ref) => {
  return (
    <Controller
      control={control}
      render={({onChange, onBlur, value}) => (
        <TextInput
          {...props}
          ref={ref as any}
          style={[styles.wrapper, success && styles.success, props.style]}
          onBlur={onBlur}
          onChangeText={value => onChange(value)}
          value={value}
        />
      )}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
    />
  );
});

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
});

export default TextField;
