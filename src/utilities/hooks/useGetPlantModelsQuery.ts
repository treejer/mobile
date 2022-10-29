import GetPlantingModels, {
  GetPlantingModelsQueryQueryData,
  GetPlantingModelsQueryQueryPartialData,
} from 'screens/TreeSubmission/screens/SelectModels/graphql/getPlantingModelsQuery.graphql';
import {usePagination} from 'utilities/hooks/usePagination';
import {useWalletAccount} from '../../redux/modules/web3/web3';

export const PlantModels = 'PlantModels';

export default function useGetPlantModelsQuery() {
  const wallet = useWalletAccount();
  return usePagination<
    GetPlantingModelsQueryQueryData,
    GetPlantingModelsQueryQueryData.Variables,
    GetPlantingModelsQueryQueryPartialData.Models[]
  >(
    GetPlantingModels,
    {
      planter: wallet.toString().toLowerCase(),
    },
    'models',
    PlantModels,
    true,
  );
}
