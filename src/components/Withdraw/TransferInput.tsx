import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';

import Card from 'components/Card';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import {shortenedString} from 'utilities/helpers/shortenedString';

export type TTransferInputProps = {
  name: string;
  label: string;
  value: string;
  onChangeText: (name: string, text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  openQRReader?: () => void;
  onPaste?: () => void;
  calcMax?: () => void;
  error?: string;
  preview?: string | number;
};

export function TransferInput(props: TTransferInputProps) {
  const {label, disabled, error, placeholder, value, name, onChangeText, preview, calcMax, openQRReader, onPaste} =
    props;

  const [inputValue, setInputValue] = useState(value || '');
  const [isTyping, setIsTyping] = useState(false);

  const {t} = useTranslation();

  useEffect(() => {
    if (isTyping) {
      setInputValue(value);
    } else {
      setInputValue(shortenedString(value, 15, 3));
    }
  }, [value]);

  const handleBlurInput = () => {
    setIsTyping(false);
    setInputValue(shortenedString(value, 15, 3));
  };

  const handleFocusInput = () => {
    setInputValue(value);
    setIsTyping(true);
  };

  return (
    <View>
      <Text style={styles.label}>{t(`transfer.form.${label}`)}</Text>
      <Card style={[styles.inputContainer, disabled && styles.disableInput]}>
        <TextInput
          style={[styles.input, disabled && styles.disableInput]}
          editable={!disabled}
          placeholder={placeholder}
          value={inputValue}
          keyboardType={preview ? 'numeric' : undefined}
          onFocus={!preview ? handleFocusInput : undefined}
          onBlur={!preview ? handleBlurInput : undefined}
          onChangeText={text => onChangeText(name, text)}
        />
        {!disabled && preview ? (
          <TouchableOpacity onPress={calcMax}>
            <Text style={styles.label}>{t('transfer.form.max')}</Text>
          </TouchableOpacity>
        ) : null}
        {!disabled && openQRReader ? (
          <View style={styles.optionsContainer}>
            <TouchableOpacity onPress={onPaste}>
              <Text style={styles.label}>{t('transfer.form.paste')}</Text>
            </TouchableOpacity>
            <Spacer />
            <TouchableOpacity onPress={openQRReader}>
              <Text style={styles.label}>
                <Icon name="qrcode" size={24} />
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </Card>
      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      {!disabled && !error && preview ? <Text style={styles.preview}>= ${preview}</Text> : null}
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
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  preview: {
    marginStart: 8,
    color: colors.gray,
  },
  errorMessage: {
    color: colors.red,
    marginLeft: 8,
    marginTop: 4,
    fontSize: 10,
  },
});
