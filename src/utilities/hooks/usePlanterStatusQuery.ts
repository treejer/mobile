import {Dispatch, useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NetworkStatus, useQuery} from '@apollo/client';

import PlanterStatusQuery, {
  PlanterStatusQueryQueryData,
} from 'screens/Profile/screens/MyProfile/graphql/PlanterStatusQuery.graphql';
import {useConfig} from 'ranger-redux/modules/web3/web3';
import {useDraftedJourneys} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';

type Planter = PlanterStatusQueryQueryData.Planter;

export const planterStatusQueryStorageKey = 'planterStatusQuery';

export default function usePlanterStatusQuery(address: string, skipStats = false) {
  const [planter, setPlanter] = usePlanterStatusQueryPersisted();

  const {drafts} = useDraftedJourneys();

  const draftedPlants = drafts.filter(draft => !draft.journey.isUpdate).length;

  const query = useQuery<PlanterStatusQueryQueryData>(PlanterStatusQuery, {
    variables: {
      id: address?.toLowerCase(),
    },
    skip: skipStats,
  });

  useEffect(() => {
    (async function () {
      const queryPlanter = query.data;
      if (queryPlanter?.planter !== undefined) {
        setPlanter(queryPlanter.planter);
        try {
          await AsyncStorage.setItem(planterStatusQueryStorageKey, JSON.stringify(queryPlanter.planter));
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
      if (newQuery?.data?.planter) {
        setPlanter(newQuery.data.planter);
      }
    } catch (e) {
      console.log(e, 'e inside refetchPlanterStatus');
    }
  }, [address, query, setPlanter]);

  const refetching = query.networkStatus === NetworkStatus.refetch;
  console.log(planter?.plantedCount, draftedPlants);
  const canPlant = planter
    ? Number(planter?.plantedCount || 0) + (draftedPlants || 0) <= Number(planter?.supplyCap)
    : null;

  return {data: planter, planterQuery: query, refetchPlanterStatus, refetching, canPlant};
}

export function usePlanterStatusQueryPersisted(): [Planter | null, Dispatch<Planter | null>] {
  const [planterState, setPlanter] = useState<Planter | null>(null);

  useEffect(() => {
    (async function () {
      try {
        let planter = await AsyncStorage.getItem(planterStatusQueryStorageKey);

        if (planter) {
          const _planter = JSON.parse(planter);

          setPlanter(_planter || null);
        }
      } catch (e) {
        console.log(e, 'Error inside ===> usePlanterStatusQuery get');
      }
    })();
  }, []);

  return [planterState, setPlanter];
}
