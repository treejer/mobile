import React from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {useTranslation} from 'react-i18next';
import Fa5Icon from 'react-native-vector-icons/FontAwesome';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import {TUserSearchValue} from 'utilities/hooks/useSearchValue';

export type SearchInInventoryProps = {
  testID?: string;
  onClose: () => void;
} & TUserSearchValue;

export function SearchInInventory(props: SearchInInventoryProps) {
  const {testID, value, handleChangeText, onClose} = props;

  const {t} = useTranslation();

  return (
    <View testID={testID} style={styles.container}>
      <View style={[globalStyles.fill, globalStyles.alignItemsStart]}>
        <Fa5Icon testID="search-icon" name="search" color={colors.green} size={22} />
      </View>
      <TextInput
        testID="search-input"
        style={styles.input}
        value={value}
        onChangeText={handleChangeText}
        placeholder={t('treeInventoryV2.search')}
        placeholderTextColor={colors.grayLight}
      />
      <TouchableOpacity
        testID="close-button"
        style={[globalStyles.fill, globalStyles.justifyContentCenter, globalStyles.alignItemsEnd]}
        onPress={onClose}
      >
        <Fa5Icon testID="close-button-icon" name="close" color={colors.green} size={22} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 6,
    color: colors.green,
    paddingVertical: 3.3,
    paddingHorizontal: 18,
    borderBottomColor: colors.grayLight,
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
});
