import {NetworkStatus, useQuery} from '@apollo/client';
import PlanterStatusQuery, {
  PlanterStatusQueryQueryData,
} from 'screens/Profile/screens/MyProfile/graphql/PlanterStatusQuery.graphql';
import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useOfflineTrees} from 'utilities/hooks/useOfflineTrees';

export const planterStatusQueryStorageKey = 'planterStatusQuery';

export default function usePlanterStatusQuery(address: string, skipStats = false) {
  const [planter, setPlanter] = usePlanterStatusQueryPersisted();

  const {offlineTrees} = useOfflineTrees();

  const query = useQuery<PlanterStatusQueryQueryData>(PlanterStatusQuery, {
    variables: {
      id: address?.toLowerCase(),
    },
    skip: skipStats,
  });

  useEffect(() => {
    (async function () {
      const queryPlanter = query.data;
      if (queryPlanter !== undefined) {
        setPlanter(queryPlanter);
        try {
          await AsyncStorage.setItem(planterStatusQueryStorageKey, JSON.stringify(queryPlanter));
        } catch (e) {
          console.log(e, 'Error inside ===> usePlanterStatusQuery set');
        }
      }
    })();
  }, [query.data, setPlanter]);

  const refetchPlanterStatus = useCallback(async () => {
    try {
      const newQuery = await query.refetch({
        id: address?.toString().toLocaleLowerCase(),
        skip: 0,
        first: 30,
      });
      if (newQuery?.data) {
        setPlanter(newQuery.data);
      }
    } catch (e) {
      console.log(e, 'e inside refetchPlanterStatus');
    }
  }, [address, query, setPlanter]);

  const refetching = query.networkStatus === NetworkStatus.refetch;
  const canPlant = planter
    ? Number(planter?.plantedCount) + (offlineTrees?.planted?.length || 0) <= Number(planter?.supplyCap)
    : null;

  return {data: planter, planterQuery: query, refetchPlanterStatus, refetching, canPlant};
}

export function usePlanterStatusQueryPersisted() {
  const [planterState, setPlanter] = useState(null);

  useEffect(() => {
    (async function () {
      try {
        let planter = await AsyncStorage.getItem(planterStatusQueryStorageKey);

        if (planter) {
          planter = JSON.parse(planter);
          setPlanter(planter);
        }
      } catch (e) {
        console.log(e, 'Error inside ===> usePlanterStatusQuery get');
      }
    })();
  }, []);

  return [planterState?.planter, setPlanter];
}
