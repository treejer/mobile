import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Feather';
import {useToast} from 'react-native-toast-notifications';

import Card from 'components/Card';
import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import {isFilterSelected} from 'utilities/helpers/isFilterSelected';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {AlertMode} from 'utilities/helpers/alert';

export type TActivityFilterProps = {
  categories: string[];
  filters: string[];
  onFilterOption: (option: string) => void;
};

export function FilterList(props: TActivityFilterProps) {
  const {filters, onFilterOption, categories} = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isConnected = useNetInfoConnected();
  const toast = useToast();

  const {t} = useTranslation();

  const handleToggleAccordion = useCallback(() => setIsOpen(prevOpen => !prevOpen), []);

  const handlePressOption = useCallback(
    category => {
      if (isConnected) {
        onFilterOption(category);
      } else {
        toast?.show('netInfo.filter', {type: AlertMode.Info, translate: true});
      }
    },
    [isConnected, onFilterOption, toast],
  );

  return (
    <View style={styles.container}>
      <Card style={styles.accordion}>
        <TouchableOpacity style={styles.row} onPress={handleToggleAccordion}>
          <Text style={styles.title}>{t('activities.filters')}</Text>
          <Icon
            style={{marginTop: 4, transform: [{rotate: isOpen ? '180deg' : '0deg'}]}}
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
                  activeOpacity={!isConnected ? 1 : undefined}
                  key={category}
                  style={[
                    styles.category,
                    !isConnected && styles.dicNetwork,
                    isFilterSelected(filters, category) && styles.selectedSlug,
                  ]}
                  onPress={() => handlePressOption(category)}
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
    fontSize: 10,
    fontWeight: '400',
    color: colors.grayLight,
  },
  category: {
    backgroundColor: colors.khaki,
    color: colors.grayDarker,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  selectedSlug: {
    borderRadius: 12,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grayDarker,
    marginRight: 4,
    marginBottom: 4,
  },
  slugText: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.white,
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  dicNetwork: {
    opacity: 0.8,
  },
});
