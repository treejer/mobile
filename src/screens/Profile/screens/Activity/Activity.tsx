import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {useQuery} from '@apollo/client';

import {MainTabsParamList} from 'types';
import {Routes, VerifiedUserNavigationParamList} from 'navigation';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {ActivityList} from 'components/Activity/ActivityList';
import globalStyles from 'constants/styles';
import Spacer from 'components/Spacer';
import {ActivityFilter} from 'screens/Profile/components/ActivityFilter';
import GetUserActivities, {
  GetUserActivitiesQueryData,
} from 'screens/Profile/screens/Activity/graphQl/getUserActivites.graphql';
import {useWalletAccount} from '../../../../redux/modules/web3/web3';
import {ActivityStatus} from 'components/Activity/ActivityItem';

interface Props {
  navigation: NavigationProp<VerifiedUserNavigationParamList>;
  route: RouteProp<MainTabsParamList, Routes.Activity>;
}

export function Activity(props: Props) {
  const {route} = props;

  const event_in = route.params?.filters;

  const wallet = useWalletAccount();

  const {data} = useQuery<GetUserActivitiesQueryData, GetUserActivitiesQueryData.Variables>(GetUserActivities, {
    variables: {
      address: wallet,
      event_in: event_in || [
        ActivityStatus.TreePlanted,
        ActivityStatus.PlanterJoined,
        ActivityStatus.TreeUpdated,
        ActivityStatus.PlanterUpdated,
        ActivityStatus.PlanterTotalClaimedUpdated,
        ActivityStatus.AcceptedByOrganization,
        ActivityStatus.BalanceWithdrew,
        ActivityStatus.OrganizationJoined,
        ActivityStatus.RejectedByOrganization,
      ],
    },
  });

  console.log(data, 'data is here');

  const [filters, setFilters] = useState<string[]>(event_in || []);

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
        <ScrollView style={styles.scrollView}>
          <ActivityList filters={filters} />
          <Spacer times={6} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
});
