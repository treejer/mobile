import React, {useCallback} from 'react';
import {NetworkStatus, useQuery} from '@apollo/client';

import {ActivityStatus} from 'components/Activity/ActivityItem';
import GetUserActivities, {
  GetUserActivitiesQueryData,
} from 'screens/Profile/screens/Activity/graphQl/getUserActivites.graphql';

const all_events = [
  ActivityStatus.TreePlanted,
  ActivityStatus.TreeUpdated,
  ActivityStatus.OrganizationMemberShareUpdated,
  ActivityStatus.OrganizationJoined,
  ActivityStatus.AcceptedByOrganization,
  ActivityStatus.RejectedByOrganization,
  ActivityStatus.BalanceWithdrew,
  ActivityStatus.PlanterTotalClaimedUpdated,
  ActivityStatus.PlanterJoined,
  ActivityStatus.PlanterUpdated,
];

export function useGetUserActivitiesQuery(wallet: string, event_in?: ActivityStatus[]) {
  const {data, ...activityQueryData} = useQuery<GetUserActivitiesQueryData, GetUserActivitiesQueryData.Variables>(
    GetUserActivities,
    {
      variables: {
        address: wallet.toLowerCase(),
        event_in: event_in?.length ? event_in : all_events,
      },
    },
  );

  const refetchUserActivity = useCallback(async (event_in?: ActivityStatus[]) => {
    try {
      await activityQueryData.refetch({
        address: wallet.toLowerCase(),
        event_in: event_in || all_events,
      });
    } catch (e: any) {
      console.log(e, 'error is here');
    }
  }, []);

  const refetching = activityQueryData.networkStatus === NetworkStatus.refetch;

  const {refetch, ..._activityQueryData} = activityQueryData;

  return {
    ...data,
    ..._activityQueryData,
    refetchUserActivity,
    refetching,
  };
}
