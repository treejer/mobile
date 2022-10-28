import React, {useCallback, useRef} from 'react';
import {FlatList, ListRenderItemInfo, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTranslation} from 'react-i18next';

import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {GetUserActivitiesQueryPartialData} from 'screens/Profile/screens/Activity/graphQl/getUserActivites.graphql';
import Spacer from 'components/Spacer';
import {ActivityItem, ActivityStatus} from 'components/Activity/ActivityItem';
import {isWeb} from 'utilities/helpers/web';
import RefreshControl from 'components/RefreshControl/RefreshControl';

export type TActivityListProps = {
  wallet: string;
  filters: ActivityStatus[];
  activities: GetUserActivitiesQueryPartialData.AddressHistories[] | null;
  refreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
};

export function ActivityList(props: TActivityListProps) {
  const {activities, refreshing, onRefresh, onLoadMore} = props;

  const {t} = useTranslation();

  const renderItem = useCallback(
    ({item, index}: ListRenderItemInfo<GetUserActivitiesQueryPartialData.AddressHistories>) => {
      return (
        <View style={globalStyles.alignItemsCenter} key={item.transactionHash}>
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
    <FlatList<GetUserActivitiesQueryPartialData.AddressHistories>
      refreshing
      onRefresh={onRefresh}
      data={activities}
      renderItem={renderItem}
      ListEmptyComponent={emptyList}
      showsVerticalScrollIndicator={false}
      refreshControl={isWeb() ? undefined : <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onEndReachedThreshold={0.1}
      initialNumToRender={20}
      onEndReached={onLoadMore}
      keyExtractor={item => (item.id as string).toString()}
    />
  );
}

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
