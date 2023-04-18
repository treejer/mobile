import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/AntDesign';

import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer';

export type EmptyListProps = {
  testID?: string;
};

export function EmptyList(props: EmptyListProps) {
  const {testID} = props;

  const {t} = useTranslation();

  return (
    <View
      testID={testID || 'empty-text-cpt'}
      style={[styles.container, globalStyles.screenView, globalStyles.alignItemsCenter]}
    >
      <Spacer times={8} />
      <View style={styles.row}>
        <Text testID="empty-text" style={styles.emptyText}>
          {t('empty')}
        </Text>
        <Spacer />
        <Icon testID="smile-icon" name="smileo" size={24} color={colors.green} />
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
