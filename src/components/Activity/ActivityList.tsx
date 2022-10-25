import React from 'react';
import {StyleSheet, View} from 'react-native';

import {ActivityItem, ActivityStatus} from 'components/Activity/ActivityItem';
import globalStyles from 'constants/styles';
import {GetUserActivitiesQueryData} from 'screens/Profile/screens/Activity/graphQl/getUserActivites.graphql';

export type TActivityListProps = {
  wallet: string;
  filters: ActivityStatus[];
  activities: GetUserActivitiesQueryData.AddressHistories[] | null | undefined;
};

export function ActivityList(props: TActivityListProps) {
  const {activities} = props;

  return activities && activities?.length ? (
    <View style={[styles.container, globalStyles.screenView]}>
      {activities.map((activity, index) => (
        <View style={globalStyles.alignItemsCenter} key={activity.transactionHash}>
          <ActivityItem activity={activity} isLast={activities && activities?.length - 1 === index} />
        </View>
      ))}
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
