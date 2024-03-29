import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FlashList} from '@shopify/flash-list';

import {Routes, VerifiedUserNavigationProp} from 'navigation/index';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {ActivityList} from 'components/Activity/ActivityList';
import {ActivityStatus} from 'components/Activity/ActivityItem';
import PullToRefresh from 'components/PullToRefresh/PullToRefresh';
import {FilterList} from 'components/Filter/FilterList';
import {Loading} from 'components/AppLoading/Loading';
import {useDebounce} from 'utilities/hooks/useDebounce';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';
import {all_events, useGetUserActivitiesQuery} from 'utilities/hooks/useGetUserActivitiesQuery';
import {useWalletAccount} from 'ranger-redux/modules/web3/web3';

const categories = [
  'all',
  ActivityStatus.TreePlanted,
  ActivityStatus.TreeUpdated,
  ActivityStatus.TreeAssigned,
  ActivityStatus.TreeVerified,
  ActivityStatus.TreeRejected,
  ActivityStatus.AssignedTreePlanted,
  ActivityStatus.AssignedTreeVerified,
  ActivityStatus.AssignedTreeRejected,
  ActivityStatus.TreeUpdatedVerified,
  ActivityStatus.TreeUpdateRejected,
  ActivityStatus.BalanceWithdrew,
  ActivityStatus.PlanterJoined,
  ActivityStatus.PlanterUpdated,
  ActivityStatus.OrganizationJoined,
  ActivityStatus.AcceptedByOrganization,
  ActivityStatus.RejectedByOrganization,
  ActivityStatus.OrganizationMemberShareUpdated,
  ActivityStatus.PlanterTotalClaimedUpdated,
];

interface Props extends VerifiedUserNavigationProp<Routes.Activity> {}

export function Activity(props: Props) {
  const {route} = props;

  const event_in = route.params?.filters;

  const [filters, setFilters] = useState<ActivityStatus[]>((event_in as ActivityStatus[]) || []);
  const debouncedFilters = useDebounce<ActivityStatus[]>(filters, 200);
  const wallet = useWalletAccount();

  const listRef = useRef<FlashList<any>>(null);

  const {
    persistedData: activities,
    refetchData: refetchUserActivity,
    query: activityQuery,
    refetching: activityRefetching,
    loadMore: ActivityLoadMore,
  } = useGetUserActivitiesQuery(wallet, debouncedFilters);

  useEffect(() => {
    (async () => {
      listRef?.current?.scrollToOffset({animated: false, offset: 0});
      await refetchUserActivity({
        address: wallet.toString().toLowerCase(),
        event_in: filters.length > 0 ? filters : all_events,
      });
    })();
  }, [debouncedFilters]);

  useRefocusEffect(() => {
    (async () => {
      await refetchUserActivity();
    })();
  });

  const {t} = useTranslation();

  const handleSelectFilterOption = useCallback(
    async (option: string) => {
      if (!filters.some(filter => filter === option)) {
        if (option === 'all') return setFilters([]);
        setFilters(filters.length === categories.length - 2 ? [] : ([...filters, option] as ActivityStatus[]));
      } else {
        setFilters(filters.filter(filter => filter !== option));
      }
    },
    [filters],
  );

  return (
    <SafeAreaView style={[globalStyles.screenView, globalStyles.fill]}>
      <Loading loading={activityQuery.loading || activityRefetching} container={true} loadingColor={colors.green}>
        <ScreenTitle goBack title={t('activity')} />
        <View style={[globalStyles.alignItemsCenter, globalStyles.fill]}>
          <FilterList categories={categories} filters={filters} onFilterOption={handleSelectFilterOption} />
          <Spacer times={4} />
          {!activityQuery.loading && (
            <PullToRefresh onRefresh={refetchUserActivity}>
              <ActivityList
                ref={listRef}
                wallet={wallet}
                filters={filters}
                activities={activities}
                refreshing={activityRefetching}
                onRefresh={refetchUserActivity}
                onLoadMore={ActivityLoadMore}
              />
              <Spacer times={6} />
            </PullToRefresh>
          )}
          <Spacer times={4} />
        </View>
      </Loading>
    </SafeAreaView>
  );
}
