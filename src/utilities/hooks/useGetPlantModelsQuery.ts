import {useCallback} from 'react';
import {NetworkStatus, useQuery} from '@apollo/client';

import GetPlantingModels, {
  GetPlantingModelsQueryQueryData,
} from 'screens/TreeSubmission/screens/SelectModels/graphql/getPlantingModelsQuery.graphql';

export default function useGetPlantModelsQuery(wallet: string) {
  const query = useQuery<GetPlantingModelsQueryQueryData, GetPlantingModelsQueryQueryData.Variables>(
    GetPlantingModels,
    {
      variables: {
        planter: wallet.toLowerCase(),
      },
    },
  );

  const refetchPlantModels = useCallback(async () => {
    try {
      const newQuery = await query.refetch({
        planter: wallet.toLocaleLowerCase(),
      });
    } catch (e) {
      console.log(e, 'e inside refetchPlanterStatus');
    }
  }, [wallet, query]);

  const refetching = query.networkStatus === NetworkStatus.refetch;

  const {refetch, ..._query} = query;

  return {..._query, refetchPlantModels, refetching};
}
