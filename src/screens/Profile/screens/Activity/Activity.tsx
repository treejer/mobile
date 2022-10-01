import React, {useCallback, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {ActivityItem, ActivityStatus, ContractTypes, TActivityItemProps} from 'components/Activity/ActivityItem';
import globalStyles from 'constants/styles';
import {ActivityFilter} from 'screens/Profile/components/ActivityFilter';

const staticActivities: TActivityItemProps[] = [
  {
    tempId: '#10',
    date: new Date(),
    status: ActivityStatus.SUBMITTED,
    address: 'https://ranger.treejer.com',
  },
  {
    tempId: '#10',
    treeId: '#1001',
    date: new Date(),
    status: ActivityStatus.VERIFIED,
    address: 'https://ranger.treejer.com',
  },
  {
    tempId: '#10',
    treeId: '#1001',
    date: new Date(),
    status: ActivityStatus.UPDATE_SUBMITTED,
    address: 'https://ranger.treejer.com',
  },
  {
    tempId: '#10',
    treeId: '#1001',
    date: new Date(),
    status: ActivityStatus.UPDATE_VERIFIED,
    address: 'https://ranger.treejer.com',
  },
  {
    date: new Date(),
    contract: ContractTypes.DAI,
    amount: '2.0025',
    status: ActivityStatus.SENT,
    address: 'https://ranger.treejer.com',
  },
  {
    date: new Date(),
    contract: ContractTypes.MATIC,
    amount: '2.0025',
    status: ActivityStatus.RECEIVED,
    address: 'https://ranger.treejer.com',
  },
  {
    date: new Date(),
    contract: ContractTypes.ETH,
    amount: '2.0025',
    status: ActivityStatus.CLAIMED,
    address: 'https://ranger.treejer.com',
  },
];

export function Activity() {
  const [filters, setFilters] = useState<string[]>(['submitted', 'verified']);

  const {t} = useTranslation();

  const handleSelectFilterOption = useCallback(
    (option: string) => {
      if (!filters.some(filter => filter === option)) {
        if (!option) return setFilters([]);
        setFilters([...filters, option]);
      } else {
        setFilters(filters.filter(filter => filter !== option));
      }
    },
    [filters],
  );

  const renderItem = useCallback(({item, index}) => {
    return (
      <View style={globalStyles.alignItemsCenter}>
        <ActivityItem {...item} isLast={staticActivities.length - 1 === index} />
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill]}>
      <ScreenTitle goBack title={t('activity')} />
      <View style={globalStyles.alignItemsCenter}>
        <ActivityFilter filters={filters} onFilterOption={handleSelectFilterOption} />
        <FlatList data={staticActivities} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />
      </View>
    </SafeAreaView>
  );
}
