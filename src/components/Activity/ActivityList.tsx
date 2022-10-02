import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';

import {ActivityItem, ActivityStatus, ContractTypes, TActivityItemProps} from 'components/Activity/ActivityItem';
import globalStyles from 'constants/styles';

const staticActivities: TActivityItemProps[] = [
  {
    tempId: '#10',
    date: new Date(),
    status: ActivityStatus.SUBMITTED,
    address: 'https://ranger.treejer.com1',
  },
  {
    tempId: '#10',
    treeId: '#1001',
    date: new Date(),
    status: ActivityStatus.VERIFIED,
    address: 'https://ranger.treejer.com2',
  },
  {
    tempId: '#10',
    treeId: '#1001',
    date: new Date(),
    status: ActivityStatus.UPDATE_SUBMITTED,
    address: 'https://ranger.treejer.com3',
  },
  {
    tempId: '#10',
    treeId: '#1001',
    date: new Date(),
    status: ActivityStatus.UPDATE_VERIFIED,
    address: 'https://ranger.treejer.com4',
  },
  {
    date: new Date(),
    contract: ContractTypes.DAI,
    amount: '2.0025',
    status: ActivityStatus.SENT,
    address: 'https://ranger.treejer.com5',
  },
  {
    date: new Date(),
    contract: ContractTypes.MATIC,
    amount: '2.0025',
    status: ActivityStatus.RECEIVED,
    address: 'https://ranger.treejer.com6',
  },
  {
    date: new Date(),
    contract: ContractTypes.ETH,
    amount: '2.0025',
    status: ActivityStatus.CLAIMED,
    address: 'https://ranger.treejer.com7',
  },
  {
    date: new Date(),
    contract: ContractTypes.ETH,
    amount: '2.0025',
    status: ActivityStatus.CLAIMED,
    address: 'https://ranger.treejer.com8',
  },
  {
    date: new Date(),
    contract: ContractTypes.ETH,
    amount: '2.0025',
    status: ActivityStatus.CLAIMED,
    address: 'https://ranger.treejer.com9',
  },
];

export type TActivityListProps = {
  filters: string[];
};

export function ActivityList(props: TActivityListProps) {
  const {filters} = props;

  const [activities, setActivities] = useState<TActivityItemProps[] | null>(staticActivities || null);

  useEffect(() => {
    if (filters.length && activities) {
      const filteredArray = staticActivities.filter(function (activity) {
        return filters.filter(function (filter) {
          return filter == activity.status;
        }).length;
      });
      setActivities(filteredArray);
    } else {
      setActivities(staticActivities);
    }
  }, [filters]);

  const renderItem = useCallback(({item, index}) => {
    return (
      <View style={globalStyles.alignItemsCenter}>
        <ActivityItem {...item} isLast={activities && activities?.length - 1 === index} />
      </View>
    );
  }, []);

  return (
    <FlatList
      style={{width: '100%'}}
      data={activities}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}
