import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';

import {MainTabsParamList} from 'types';
import {Routes, VerifiedUserNavigationParamList} from 'navigation';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {ActivityList} from 'components/Activity/ActivityList';
import {ActivityStatus} from 'components/Activity/ActivityItem';
import PullToRefresh from 'components/PullToRefresh/PullToRefresh';
import {ActivityFilter, categories} from 'screens/Profile/components/ActivityFilter';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';
import {all_events, useGetUserActivitiesQuery} from 'utilities/hooks/useGetUserActivitiesQuery';
import {useWalletAccount} from '../../../../redux/modules/web3/web3';
import {useDebounce} from 'utilities/hooks/useDebounce';

interface Props {
  navigation: NavigationProp<VerifiedUserNavigationParamList>;
  route: RouteProp<MainTabsParamList, Routes.Activity>;
}

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
      <ScreenTitle goBack title={t('activity')} />
      <View style={[globalStyles.alignItemsCenter, globalStyles.fill]}>
        <ActivityFilter filters={filters} onFilterOption={handleSelectFilterOption} />
        <Spacer times={4} />
        {activityQuery.loading ? (
          <View
            style={[
              globalStyles.fill,
              globalStyles.alignItemsCenter,
              globalStyles.justifyContentCenter,
              styles.loadingContainer,
            ]}
          >
            <ActivityIndicator size="large" color={colors.green} />
          </View>
        ) : (
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
