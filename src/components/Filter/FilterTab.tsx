import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {Tab} from 'components/Filter/FilterTabBar';
import Spacer from 'components/Spacer';

export type FilterTabProps<T> = {
  testID?: string;
  tab: Tab<T>;
  onPress: () => void;
  isActive: boolean;
};

export function FilterTab<T>(props: FilterTabProps<T>) {
  const {
    testID,
    tab: {title, icon},
    isActive,
    onPress,
  } = props;

  const {t} = useTranslation();

  return (
    <View testID={testID} style={[styles.container, isActive ? styles.borderButton : {}]}>
      <TouchableOpacity style={styles.btn} testID={`tab-button-${title}`} onPress={onPress}>
        {icon ? (
          <>
            <FAIcon
              testID="tab-button-icon"
              name={icon}
              size={20}
              color={isActive ? colors.green : colors.grayMidLight}
            />
            <Spacer />
          </>
        ) : null}
        <Text testID="tab-button-text" style={[styles.text, {color: isActive ? colors.green : colors.grayMidLight}]}>
          {t(title)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.fill,
    paddingVertical: 8,
    height: 40,
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
  },
  btn: {
    ...globalStyles.alignItemsCenter,
    ...globalStyles.justifyContentCenter,
    flex: 1,
    flexDirection: 'row',
  },
  borderButton: {
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: colors.green,
  },
});
