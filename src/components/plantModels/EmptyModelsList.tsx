import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import {colors} from 'constants/values';

export function EmptyModelsList() {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>{t('selectModels.createFirst')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 360,
    alignItems: 'center',
  },
  txt: {
    fontSize: 16,
    color: colors.grayDarker,
  },
});
