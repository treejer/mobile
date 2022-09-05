import React, {useMemo, useState} from 'react';
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
  preview?: string | number;
  calcMax?: () => void;
};

export function TransferInput(props: TTransferInputProps) {
  const {label, disabled, placeholder, value, onChangeText, preview, calcMax, openQRReader} = props;

  const {t} = useTranslation();

  return (
    <View>
      <Text style={styles.label}>{t(`transfer.form.${label}`)}</Text>
      <Card style={[styles.inputContainer, disabled && styles.disableInput]}>
        <TextInput
          style={[styles.input, disabled && styles.disableInput]}
          editable={!disabled}
          placeholder={placeholder || '...'}
          value={value}
          onChangeText={onChangeText}
        />
        {!disabled && preview && (
          <TouchableOpacity onPress={calcMax}>
            <Text style={styles.label}>{t('transfer.form.max')}</Text>
          </TouchableOpacity>
        )}
        {!disabled && openQRReader && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity onPress={() => console.log('paste')}>
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
      {!disabled && preview && <Text style={styles.preview}>= ${preview}</Text>}
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
});
