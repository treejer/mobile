import GetUserActivities, {
  GetUserActivitiesQueryData,
  GetUserActivitiesQueryPartialData,
} from 'screens/Profile/screens/Activity/graphQl/getUserActivites.graphql';
import {usePagination} from 'utilities/hooks/usePagination';
import {ActivityStatus} from 'components/Activity/ActivityItem';

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
