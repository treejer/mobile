import React, {useCallback, forwardRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTranslation} from 'react-i18next';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';

import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {GetUserActivitiesQueryPartialData} from 'screens/Profile/screens/Activity/graphQl/getUserActivites.graphql';
import Spacer from 'components/Spacer';
import {ActivityItem, ActivityStatus} from 'components/Activity/ActivityItem';
import {OptimizedList} from 'components/TreeListV2/OptimizedList';

export type TActivityListProps = {
  wallet: string;
  filters: ActivityStatus[];
  activities: GetUserActivitiesQueryPartialData.AddressHistories[] | null;
  refreshing: boolean;
  loading: boolean;
  onRefresh: () => Promise<any>;
  onLoadMore: () => void;
};

export const ActivityList = forwardRef<
  FlashList<GetUserActivitiesQueryPartialData.AddressHistories>,
  TActivityListProps
>((props, ref) => {
  const {activities, refreshing, loading, onRefresh, onLoadMore} = props;

  const {t} = useTranslation();

  const renderItem = useCallback(
    ({item, index}: ListRenderItemInfo<GetUserActivitiesQueryPartialData.AddressHistories>) => {
      return (
        <View style={globalStyles.alignItemsCenter}>
          <ActivityItem activity={item} isLast={(activities && activities?.length - 1) === index} />
        </View>
      );
    },
    [activities],
  );

  const emptyList = useCallback(() => {
    return (
      <View style={[styles.container, globalStyles.screenView, globalStyles.alignItemsCenter]}>
        <Spacer times={8} />
        <View style={styles.row}>
          <Text style={styles.emptyText}>{t('activities.empty')}</Text>
          <Spacer />
          <Icon name="smileo" size={24} color={colors.green} />
        </View>
      </View>
    );
  }, [activities]);

  return (
    <View style={[{width: '100%', flex: 1}, globalStyles.screenView]}>
      <OptimizedList<GetUserActivitiesQueryPartialData.AddressHistories>
        ref={ref}
        refetching={refreshing}
        loading={loading}
        onRefetch={onRefresh}
        data={activities}
        renderItem={renderItem}
        estimatedItemSize={78}
        ListEmptyComponent={emptyList}
        onEndReached={() => {
          console.log('reached end');
          onLoadMore();
        }}
        keyExtractor={item => (item.id as string).toString()}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.green,
  },
});
