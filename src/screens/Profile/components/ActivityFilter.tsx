import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Feather';

import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import {isFilterSelected} from 'utilities/helpers/isFilterSelected';

export type TActivityFilterProps = {
  filters: string[];
  onFilterOption: (option: string) => void;
};

const categories = ['all', 'verified', 'submitted', 'updateSubmitted', 'updateVerified', 'sent', 'received', 'claimed'];

export function ActivityFilter(props: TActivityFilterProps) {
  const {filters, onFilterOption} = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {t} = useTranslation();

  const handleToggleAccordion = useCallback(() => setIsOpen(prevOpen => !prevOpen), []);

  return (
    <View style={styles.container}>
      <Card style={styles.accordion}>
        <TouchableOpacity style={styles.row} onPress={handleToggleAccordion}>
          <Text style={styles.title}>{t('activities.filters')}</Text>
          <Icon
            style={{marginTop: 4, transform: [{rotate: isOpen ? '90deg' : '0deg'}]}}
            name="chevron-down"
            size={20}
            color={colors.grayDarker}
          />
        </TouchableOpacity>
        {isOpen && (
          <>
            <Spacer />
            <View style={styles.categoryList}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[styles.category, isFilterSelected(filters, category) && styles.selectedSlug]}
                  onPress={() => onFilterOption(category)}
                >
                  <Text style={[styles.categoryText, isFilterSelected(filters, category) && styles.slugText]}>
                    {t(`activities.${category}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </Card>
      <Spacer />
      {filters.length > 0 && !isOpen && (
        <View style={styles.selectedList}>
          {filters.map(filter => (
            <TouchableOpacity key={filter} style={styles.selectedSlug} onPress={() => onFilterOption(filter)}>
              <Icon name="x-circle" size={20} color={colors.white} />
              <Spacer />
              <Text style={styles.slugText}>{t(`activities.${filter}`)}</Text>
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
  categoryText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.grayLight,
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
    fontSize: 14,
    fontWeight: '400',
    color: colors.white,
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
