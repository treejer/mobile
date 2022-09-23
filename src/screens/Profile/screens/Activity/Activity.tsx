import React, {useCallback} from 'react';
import {FlatList, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {ActivityItem, ActivityStatus, ContractTypes, TActivityItemProps} from 'components/Activity/ActivityItem';
import globalStyles from 'constants/styles';

const staticActivities: TActivityItemProps[] = [
  {
    tempId: '#10',
    date: new Date(),
    status: ActivityStatus.SUBMITTED,
  },
  {
    tempId: '#10',
    treeId: '#1001',
    date: new Date(),
    status: ActivityStatus.VERIFIED,
  },
  {
    tempId: '#10',
    treeId: '#1001',
    date: new Date(),
    status: ActivityStatus.UPDATESUBMITTED,
  },
  {
    tempId: '#10',
    treeId: '#1001',
    date: new Date(),
    status: ActivityStatus.UPDATEVERIFIED,
  },
  {
    date: new Date(),
    contract: ContractTypes.DAI,
    amount: '2.0025',
    status: ActivityStatus.SENT,
  },
  {
    date: new Date(),
    contract: ContractTypes.MATIC,
    amount: '2.0025',
    status: ActivityStatus.RECEIVED,
  },
  {
    date: new Date(),
    contract: ContractTypes.ETH,
    amount: '2.0025',
    status: ActivityStatus.CLAIMED,
  },
];

export function Activity() {
  const {t} = useTranslation();

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
        <FlatList
          style={{width: '100%', overflow: 'visible'}}
          data={staticActivities}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
}
