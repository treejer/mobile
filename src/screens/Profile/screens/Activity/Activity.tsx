import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {ActivityList} from 'components/Activity/ActivityList';
import globalStyles from 'constants/styles';
import {ActivityFilter} from 'screens/Profile/components/ActivityFilter';

export function Activity() {
  const [filters, setFilters] = useState<string[]>([]);

  const {t} = useTranslation();

  const handleSelectFilterOption = useCallback(
    (option: string) => {
      if (!filters.some(filter => filter === option)) {
        if (option === 'all') return setFilters([]);
        setFilters(filters.length === 6 ? [] : [...filters, option]);
      } else {
        setFilters(filters.filter(filter => filter !== option));
      }
    },
    [filters],
  );

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill]}>
      <ScreenTitle goBack title={t('activity')} />
      <View style={[globalStyles.alignItemsCenter, globalStyles.fill]}>
        <ActivityFilter filters={filters} onFilterOption={handleSelectFilterOption} />
        <ActivityList filters={filters} />
      </View>
    </SafeAreaView>
  );
}
