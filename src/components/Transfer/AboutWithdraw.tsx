import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {colors} from 'constants/values';

export function AboutWithdraw() {
  const {t} = useTranslation();

  return (
    <Card style={styles.infoContainer}>
      <Text style={styles.infoTitle}>{t('transfer.info.title')}</Text>
      <Spacer times={2} />
      <Text style={styles.infoDesc}>{t('transfer.info.desc')}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    width: 360,
    paddingVertical: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.grayDarker,
  },
  infoDesc: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.grayLight,
  },
});
