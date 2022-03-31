import {useQuery, NetworkStatus} from '@apollo/client';
import {Dispatch, useCallback, useEffect, useMemo, useState} from 'react';
import planterTreeQuery, {
  PlanterTreesQueryQueryData,
} from 'screens/GreenBlock/screens/MyCommunity/graphql/PlanterTreesQuery.graphql';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TreeFilter} from 'components/TreeList/TreeList';
import {Tree} from 'types';

export default function usePlantedTrees(address) {
  const [plantedTrees, setPlantedTrees] = usePersistedPlantedTrees();

  const perPage = useMemo(() => 40, []);

  const [page, setPage] = useState(0);

  const paginationProps = useCallback(
    (newPage: number) => ({
      first: perPage,
      skip: newPage * perPage,
    }),
    [perPage],
  );

  const query = useQuery<PlanterTreesQueryQueryData>(planterTreeQuery, {
    variables: {
      address: address?.toString().toLocaleLowerCase(),
      ...paginationProps(page),
    },
    skip: !address,
  });

  const trees = query?.data?.trees as unknown as Tree[];

  useEffect(() => {
    (async function () {
      if (trees !== undefined) {
        setPlantedTrees(trees);
        try {
          await AsyncStorage.setItem(TreeFilter.Submitted, JSON.stringify(trees));
        } catch (e) {
          console.log(e, 'Error inside ===> usePlantedTrees set');
        }
      }
    })();
  }, [trees, setPlantedTrees]);

  const refetchPlantedTrees = useCallback(async () => {
    setPage(0);
    await query.refetch({
      address: address?.toString().toLocaleLowerCase(),
      ...paginationProps(0),
    });
  }, [address, query, setPage, paginationProps]);

  const refetching = query.networkStatus === NetworkStatus.refetch;

  const loadMore = useCallback(async () => {
    const newPage = page + 1;
    try {
      await query.fetchMore({
        variables: {
          address: address?.toString().toLocaleLowerCase(),
          ...paginationProps(newPage),
        },
      });
      setPage(newPage);
    } catch (e) {
      console.log(e, 'e is here loadMore');
    }
  }, [address, page, paginationProps, query]);

  return {plantedTrees, plantedTreesQuery: query, refetchPlantedTrees, refetching, loadMore};
}

export function usePersistedPlantedTrees(): [Tree[] | null, Dispatch<Tree[] | null>] {
  const [plantedTrees, setPlantedTrees] = useState<Tree[] | null>(null);

  useEffect(() => {
    (async function () {
      try {
        let submittedTrees = await AsyncStorage.getItem(TreeFilter.Submitted);

        if (submittedTrees) {
          const _submittedTrees = JSON.parse(submittedTrees);
          setPlantedTrees(_submittedTrees);
        }
      } catch (e) {
        console.log(e, 'Error inside ===> usePlantedTrees get');
      }
    })();
  }, []);

  return [plantedTrees, setPlantedTrees];
}
