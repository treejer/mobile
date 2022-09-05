import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';

import Card from 'components/Card';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer';

export type TTransferInputProps = {
  label: string;
  placeholder?: string;
  disabled?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  openQRReader?: () => void;
  onPaste?: () => Promise<string>;
  preview?: string | number;
  calcMax?: () => void;
  error: string;
};

export function TransferInput(props: TTransferInputProps) {
  const {label, disabled, error, placeholder, value, onChangeText, preview, calcMax, openQRReader, onPaste} = props;
  const [inputValue, setInputValue] = useState(value || '');
  const [isTyping, setIsTyping] = useState(false);

  const {t} = useTranslation();

  useEffect(() => {
    if (isTyping) {
      setInputValue(value);
    } else {
      setInputValue(value.length > 20 ? `${value.slice(0, 10)}...${value.slice(value.length - 3)}` : value);
    }
  }, [value]);

  const handleBlurInput = () => {
    setIsTyping(false);
    setInputValue(value.length > 20 ? `${value.slice(0, 10)}...${value.slice(value.length - 3)}` : value);
  };

  const handleFocusInput = () => {
    setInputValue(value);
    setIsTyping(true);
  };

  const handlePaste = async () => {
    try {
      await onPaste?.();
    } catch (e) {
      console.log(e, 'paste error');
    }
  };

  return (
    <View>
      <Text style={styles.label}>{t(`transfer.form.${label}`)}</Text>
      <Card style={[styles.inputContainer, disabled && styles.disableInput]}>
        <TextInput
          style={[styles.input, disabled && styles.disableInput]}
          editable={!disabled}
          placeholder={placeholder || '...'}
          value={inputValue}
          keyboardType={preview ? 'numeric' : undefined}
          onFocus={!preview ? handleFocusInput : undefined}
          onBlur={!preview ? handleBlurInput : undefined}
          onChangeText={onChangeText}
        />
        {!disabled && preview && (
          <TouchableOpacity onPress={calcMax}>
            <Text style={styles.label}>{t('transfer.form.max')}</Text>
          </TouchableOpacity>
        )}
        {!disabled && openQRReader && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity onPress={handlePaste}>
              <Text style={styles.label}>{t('transfer.form.paste')}</Text>
            </TouchableOpacity>
            <Spacer />
            <TouchableOpacity onPress={openQRReader}>
              <Text style={styles.label}>
                <Icon name="qrcode" size={24} />
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>
      {error && <Text style={styles.errorMessage}>{error}</Text>}
      {!disabled && !error && preview && <Text style={styles.preview}>= ${preview}</Text>}
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
  },
  disableInput: {
    backgroundColor: colors.khakiDark,
    color: colors.gray,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
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
