import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import globalStyles from 'constants/styles';
import Spacer from 'components/Spacer';
import Icon from 'react-native-vector-icons/AntDesign';
import {colors} from 'constants/values';
import {useTranslation} from 'react-i18next';

export function EmptyList() {
  const {t} = useTranslation();

  return (
    <View style={[styles.container, globalStyles.screenView, globalStyles.alignItemsCenter]}>
      <Spacer times={8} />
      <View style={styles.row}>
        <Text style={styles.emptyText}>{t('activities.empty')}</Text>
        <Spacer />
        <Icon name="smileo" size={24} color={colors.green} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.green,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
