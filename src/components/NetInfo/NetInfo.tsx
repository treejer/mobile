import {colors} from 'constants/values';

import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Card from 'components/Card';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {showAlert} from 'utilities/helpers/alert';

export default function NetInfo() {
  const isConnected = useNetInfoConnected();

  const insets = useSafeAreaInsets();

  const {t} = useTranslation();

  useEffect(() => {
    if (isConnected === false) {
      showAlert({
        title: t('netInfo.error'),
        message: t('netInfo.details'),
      });
    }
  }, [isConnected, t]);

  const text = isConnected ? 'Online' : 'Offline';
  const bgStyle = isConnected ? styles.online : styles.offline;

  if (isConnected === null) {
    return null;
  }

  return (
    <View style={[styles.container, {top: insets.top + 4}]}>
      <Card style={[styles.card, bgStyle]}>
        <Text style={styles.text}>{text}</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 4,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    width: -1,
    zIndex: 9,
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
