import React, {useCallback, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationProp, RouteProp} from '@react-navigation/native';

import {MainTabsParamList} from 'types';
import {Routes, VerifiedUserNavigationParamList} from 'navigation';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {ActivityList} from 'components/Activity/ActivityList';
import {ActivityStatus} from 'components/Activity/ActivityItem';
import RefreshControl from 'components/RefreshControl/RefreshControl';
import PullToRefresh from 'components/PullToRefresh/PullToRefresh';
import {ActivityFilter} from 'screens/Profile/components/ActivityFilter';
import {isWeb} from 'utilities/helpers/web';
import {useRefocusEffect} from 'utilities/hooks/useRefocusEffect';
import {useGetUserActivitiesQuery} from 'utilities/hooks/useGetUserActivitiesQuery';
import {useWalletAccount} from '../../../../redux/modules/web3/web3';

interface Props {
  navigation: NavigationProp<VerifiedUserNavigationParamList>;
  route: RouteProp<MainTabsParamList, Routes.Activity>;
}

export function Activity(props: Props) {
  const {route} = props;

  const event_in = route.params?.filters;

  const [filters, setFilters] = useState<ActivityStatus[]>((event_in as ActivityStatus[]) || []);
  const wallet = useWalletAccount();

  const {
    loading,
    addressHistories: activities,
    refetchUserActivity,
    refetching,
  } = useGetUserActivitiesQuery(wallet, filters);

  useRefocusEffect(() => {
    (async () => {
      await refetchUserActivity();
    })();
  });

  const {t} = useTranslation();

  const handleSelectFilterOption = useCallback(
    (option: string) => {
      if (!filters.some(filter => filter === option)) {
        if (option === 'all') return setFilters([]);
        setFilters(filters.length === 9 ? [] : ([...filters, option] as ActivityStatus[]));
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
        {loading ? (
          <View style={[globalStyles.fill, globalStyles.alignItemsCenter, globalStyles.justifyContentCenter]}>
            <ActivityIndicator size="large" color={colors.green} />
          </View>
        ) : (
          <>
            <ActivityFilter filters={filters} onFilterOption={handleSelectFilterOption} />
            <PullToRefresh onRefresh={refetchUserActivity}>
              <ScrollView
                style={styles.scrollView}
                refreshControl={
                  isWeb() ? undefined : <RefreshControl refreshing={refetching} onRefresh={refetchUserActivity} />
                }
              >
                <ActivityList wallet={wallet} filters={filters} activities={activities} />
                <Spacer times={6} />
              </ScrollView>
            </PullToRefresh>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
});
