import React, {useCallback, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationProp, RouteProp} from '@react-navigation/native';

import {MainTabsParamList} from 'types';
import {Routes, VerifiedUserNavigationParamList} from 'navigation';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import {ActivityList} from 'components/Activity/ActivityList';
import Spacer from 'components/Spacer';
import {ActivityStatus} from 'components/Activity/ActivityItem';
import {ContainerLoading} from 'components/AppLoading/LoadingContainer';
import {useGetUserActivitiesQuery} from 'utilities/hooks/useGetUserActivitiesQuery';
import globalStyles from 'constants/styles';
import {ActivityFilter} from 'screens/Profile/components/ActivityFilter';
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

  const {loading, addressHistories: activities} = useGetUserActivitiesQuery(wallet, filters);

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
      <ContainerLoading loading={loading} container>
        <ScreenTitle goBack title={t('activity')} />
        <View style={[globalStyles.alignItemsCenter, globalStyles.fill]}>
          <ActivityFilter filters={filters} onFilterOption={handleSelectFilterOption} />
          <ScrollView style={styles.scrollView}>
            <ActivityList wallet={wallet} filters={filters} activities={activities} />
            <Spacer times={6} />
          </ScrollView>
        </View>
      </ContainerLoading>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
});
