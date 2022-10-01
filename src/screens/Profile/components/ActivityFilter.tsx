import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Feather';

import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {colors} from 'constants/values';

export type TActivityFilterProps = {
  filters: string[];
  onFilterOption: (option: string) => void;
};

const categories: {
  label: string;
  value: string;
}[] = [
  {label: 'all', value: ''},
  {label: 'verified', value: 'verified'},
  {label: 'submitted', value: 'submitted'},
  {label: 'update submitted', value: 'update submitted'},
  {label: 'update verified', value: 'update verified'},
  {label: 'sent', value: 'sent'},
  {label: 'received', value: 'received'},
  {label: 'earned', value: 'earned'},
];

export function ActivityFilter(props: TActivityFilterProps) {
  const {filters, onFilterOption} = props;

  const [open, setOpen] = useState<boolean>(false);

  const {t} = useTranslation();

  const handleToggleAccordion = useCallback(() => setOpen(prevOpen => !prevOpen), []);

  return (
    <View style={styles.container}>
      <Card style={styles.accordion}>
        <View style={styles.row}>
          <Text style={styles.title}>{t('activities.filters')}</Text>
          <TouchableOpacity onPress={handleToggleAccordion}>
            <Icon
              style={{marginTop: 4, transform: [{rotate: open ? '90deg' : '0deg'}]}}
              name="chevron-down"
              size={20}
              color={colors.grayDarker}
            />
          </TouchableOpacity>
        </View>
        {open && (
          <>
            <Spacer />
            <View style={styles.categoryList}>
              {categories.map(category => (
                <TouchableOpacity
                  style={[
                    styles.category,
                    (filters.includes(category.value) || (filters.length === 0 && !category.value)) &&
                      styles.selectedSlug,
                  ]}
                  onPress={() => onFilterOption(category.value)}
                >
                  <Text
                    style={
                      (filters.includes(category.value) || (filters.length === 0 && !category.value)) && styles.slugText
                    }
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </Card>
      <Spacer />
      {filters.length > 0 && !open && (
        <View style={styles.selectedList}>
          {filters.map(filter => (
            <TouchableOpacity style={styles.selectedSlug} onPress={() => onFilterOption(filter)} key={filter}>
              <Icon name="x-circle" size={20} color={colors.white} />
              <Spacer />
              <Text style={styles.slugText}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 358,
  },
  accordion: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: colors.khakiDark,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.grayDarker,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  category: {
    backgroundColor: colors.khaki,
    color: colors.grayDarker,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 100,
    marginRight: 4,
    marginBottom: 4,
  },
  selectedSlug: {
    borderRadius: 20,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grayDarker,
    marginRight: 4,
    marginBottom: 4,
  },
  slugText: {
    color: colors.white,
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
