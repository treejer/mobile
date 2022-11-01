import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TextInput, View} from 'react-native';
import {Control, Controller} from 'react-hook-form';
import Card from 'components/Card';
import {useTranslation} from 'react-i18next';
import CountryPicker, {Country, CountryCode} from 'react-native-country-picker-modal';

import {colors} from 'constants/values';
import {isWeb} from 'utilities/helpers/web';
import Spacer from 'components/Spacer';
import {TCreateModelForm} from 'screens/TreeSubmission/components/Models/CreateModelForm';

export type TCreateModelInputProps = {
  control: Control<TCreateModelForm>;
  name: keyof TCreateModelForm;
  value?: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  preview?: string | number;
  countryCode?: CountryCode;
  onSelectCountry?: (country: Country) => void;
  onCloseCountry?: () => void;
  availableCountries?: CountryCode[] | null;
};

export function CreateModelInput(props: TCreateModelInputProps) {
  const {
    control,
    name,
    value,
    error,
    placeholder,
    label,
    disabled,
    preview,
    countryCode,
    availableCountries,
    onSelectCountry,
    onCloseCountry,
  } = props;

  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const {t} = useTranslation();

  const handleCloseCountryPicker = () => {
    setShowCountryPicker(false);
    onCloseCountry?.();
  };

  const renderInput = () => {
    if (name === 'country') {
      return (
        <View style={[styles.inputContainer, {paddingLeft: 0}]}>
          <Text
            onPress={() => setShowCountryPicker(true)}
            style={[
              styles.input,
              disabled && styles.disableInput,
              {color: value ? (disabled ? colors.gray : colors.black) : colors.placeholder},
            ]}
          >
            {value || placeholder}
          </Text>
          {availableCountries && availableCountries?.length > 0 ? (
            <CountryPicker
              visible={showCountryPicker}
              countryCodes={availableCountries}
              countryCode={countryCode || 'US'}
              withFlag
              withAlphaFilter={!isWeb()}
              withFilter
              withEmoji
              onOpen={() => setShowCountryPicker(true)}
              onSelect={onSelectCountry}
              onClose={handleCloseCountryPicker}
            />
          ) : (
            <>
              <ActivityIndicator />
              <Spacer />
            </>
          )}
        </View>
      );
    } else {
      return (
        <Controller
          control={control}
          name={name}
          render={({field: {onChange, onBlur, value}, formState}) => (
            <TextInput
              style={[styles.input, disabled ? styles.disableInput : undefined]}
              editable={!disabled}
              placeholder={placeholder}
              placeholderTextColor={colors.placeholder}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
      );
    }
  };

  return (
    <View>
      <Text style={styles.label}>{t(`createModel.form.${label}`)}</Text>
      <Card style={[styles.inputContainer, disabled && styles.disableInput]}>{renderInput()}</Card>
      {!disabled && !error && preview ? <Text style={styles.preview}>= ${preview}</Text> : null}
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
  },
  disableInput: {
    backgroundColor: colors.khakiDark,
    color: colors.gray,
  },
  preview: {
    marginStart: 8,
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
