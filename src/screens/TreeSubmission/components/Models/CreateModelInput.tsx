import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Control, Controller} from 'react-hook-form';
import Card from 'components/Card';
import {useTranslation} from 'react-i18next';

import {colors} from 'constants/values';
import {TCreateModelForm} from 'screens/TreeSubmission/screens/SelectModels/CreateModel';

export type TCreateModelInputProps = {
  control: Control<TCreateModelForm>;
  name: keyof TCreateModelForm;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
};

export function CreateModelInput(props: TCreateModelInputProps) {
  const {control, name, error, placeholder, label, disabled} = props;

  const {t} = useTranslation();

  return (
    <View>
      <Text style={styles.label}>{t(`createModel.form.${label}`)}</Text>
      <Card style={[styles.inputContainer, disabled && styles.disableInput]}>
        <Controller
          control={control}
          name={name}
          render={({field: {onChange, onBlur, value}, formState}) => (
            <TextInput
              style={[styles.input, disabled && styles.disableInput]}
              editable={!disabled}
              placeholder={placeholder}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
      </Card>
      {!disabled && error ? (
        <Text style={styles.errorMessage}>{t(`createModel.errors.${error}`, {field: name})}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: 360,
    height: 40,
    paddingVertical: 0,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: colors.black,
  },
  disableInput: {
    backgroundColor: colors.khakiDark,
    color: colors.gray,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
    paddingLeft: 4,
    paddingBottom: 4,
  },
  errorMessage: {
    color: colors.red,
    marginLeft: 8,
    marginTop: 4,
    fontSize: 10,
  },
});
