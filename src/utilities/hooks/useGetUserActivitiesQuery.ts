import GetUserActivities, {
  GetUserActivitiesQueryData,
  GetUserActivitiesQueryPartialData,
} from 'screens/Profile/screens/Activity/graphQl/getUserActivites.graphql';
import {usePagination} from 'utilities/hooks/usePagination';
import {ActivityStatus} from 'components/Activity/ActivityItem';

export const all_events = [
  ActivityStatus.PlanterJoined,
  ActivityStatus.OrganizationJoined,
  ActivityStatus.PlanterUpdated,
  ActivityStatus.AcceptedByOrganization,
  ActivityStatus.RejectedByOrganization,
  ActivityStatus.OrganizationMemberShareUpdated,
  ActivityStatus.PlanterTotalClaimedUpdated,
  ActivityStatus.BalanceWithdrew,
  ActivityStatus.TreePlanted,
  ActivityStatus.TreeUpdated,
  ActivityStatus.TreeAssigned,
  ActivityStatus.AssignedTreePlanted,
  ActivityStatus.AssignedTreeVerified,
  ActivityStatus.AssignedTreeRejected,
  ActivityStatus.TreeVerified,
  ActivityStatus.TreeRejected,
  ActivityStatus.TreeUpdatedVerified,
  ActivityStatus.TreeUpdateRejected,
];

export const AddressHistories = 'AddressHistories';

export function useGetUserActivitiesQuery(wallet: string, event_in?: ActivityStatus[]) {
  return usePagination<
    GetUserActivitiesQueryData,
    GetUserActivitiesQueryData.Variables,
    GetUserActivitiesQueryPartialData.AddressHistories[]
  >(
    GetUserActivities,
    {
      address: wallet.toLowerCase(),
      event_in: event_in?.length ? event_in : all_events,
    },
    'addressHistories',
    AddressHistories,
    true,
  );
}
