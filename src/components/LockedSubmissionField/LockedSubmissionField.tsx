import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';

import {isElementOrComponent} from 'utilities/helpers/checkElements';
import {colors} from 'constants/values';
import Card from 'components/Card';
import Spacer from 'components/Spacer';

export type LockedSubmissionFieldProps = {
  testID?: string;
  title?: string;
  description?: string;
  icon?: string | JSX.Element;
};

export function LockedSubmissionField(props: LockedSubmissionFieldProps) {
  const {testID, title, description, icon} = props;

  const {t} = useTranslation();

  return (
    <Card testID={testID} style={styles.container}>
      <View>
        <Text testID="locked-title" style={styles.title}>
          {t(title || 'lockedField.defTitle')}
        </Text>
        <Spacer times={4} />
        <Text testID="locked-desc" style={styles.desc}>
          {t(description || 'lockedField.defDesc')}
        </Text>
      </View>
      <Spacer />
      {isElementOrComponent(icon) ? (
        icon
      ) : (
        <TouchableOpacity style={styles.iconContainer} disabled activeOpacity={1}>
          <Icon testID="locked-icon" name={icon ? icon.toString() : 'lock'} color={colors.khakiDark} size={24} />
        </TouchableOpacity>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.khakiDark,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 104,
  },
  title: {
    color: colors.grayDarker,
    fontSize: 20,
    fontWeight: '500',
  },
  desc: {
    color: colors.grayDarker,
    fontSize: 14,
    fontWeight: '600',
  },
  iconContainer: {
    backgroundColor: colors.grayDarker,
    borderRadius: 50,
    width: 120,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
