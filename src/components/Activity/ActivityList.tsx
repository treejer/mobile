import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTranslation} from 'react-i18next';

import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import {GetUserActivitiesQueryData} from 'screens/Profile/screens/Activity/graphQl/getUserActivites.graphql';
import Spacer from 'components/Spacer';
import {ActivityItem, ActivityStatus} from 'components/Activity/ActivityItem';

export type TActivityListProps = {
  wallet: string;
  filters: ActivityStatus[];
  activities: GetUserActivitiesQueryData.AddressHistories[] | null | undefined;
};

export function ActivityList(props: TActivityListProps) {
  const {activities} = props;

  const {t} = useTranslation();

  return activities && activities?.length ? (
    <View style={[styles.container, globalStyles.screenView]}>
      {activities.map((activity, index) => (
        <View style={globalStyles.alignItemsCenter} key={activity.transactionHash}>
          <ActivityItem activity={activity} isLast={activities && activities?.length - 1 === index} />
        </View>
      ))}
    </View>
  ) : (
    <View style={[styles.container, globalStyles.screenView, globalStyles.alignItemsCenter]}>
      <Spacer times={8} />
      <View style={styles.row}>
        <Text style={styles.emptyText}>{t('activities.empty')}</Text>
        <Spacer />
        <Icon name="smileo" size={24} color={colors.green} />
      </View>
    </View>
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
