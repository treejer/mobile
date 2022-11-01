import {colors} from 'constants/values';

import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Card from 'components/Card';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {useTranslation} from 'react-i18next';
import {showAlert} from 'utilities/helpers/alert';
import {isWeb} from 'utilities/helpers/web';

export default function NetInfo() {
  const isConnected = useNetInfoConnected();

  const {t} = useTranslation();

  useEffect(() => {
    if (isConnected === false) {
      showAlert({
        title: t('netInfo.error'),
        message: t(`netInfo.details${isWeb() ? 'Web' : ''}`),
      });
    }
  }, [isConnected, t]);

  const text = isConnected ? 'Online' : 'Offline';
  const bgStyle = isConnected ? styles.online : styles.offline;

  if (isConnected === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Card style={[styles.card, bgStyle]}>
        <Text style={styles.text}>{text}</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: -1,
  },
  card: {
    width: -1,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  online: {
    backgroundColor: colors.green,
  },
  offline: {
    backgroundColor: colors.red,
  },
  text: {
    fontSize: 9,
    color: colors.khaki,
  },
});
