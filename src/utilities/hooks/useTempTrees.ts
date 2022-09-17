import {useQuery, NetworkStatus} from '@apollo/client';
import {useCallback, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TreeFilter} from 'components/TreeList/TreeFilterItem';
import TempTreeQuery, {
  TempTreesQueryQueryData,
  TempTreesQueryQueryPartialData,
} from 'screens/GreenBlock/screens/MyCommunity/graphql/TempTreesQuery.graphql';

export default function useTempTrees(address) {
  const [tempTrees, setTempTrees] = useState<TempTreesQueryQueryPartialData.TempTrees[] | null>(null);

  const perPage = useMemo(() => 40, []);

  const [page, setPage] = useState(0);

  const paginationProps = useCallback(
    (newPage: number) => ({
      first: perPage,
      skip: newPage * perPage,
    }),
    [perPage],
  );

  const query = useQuery<TempTreesQueryQueryData>(TempTreeQuery, {
    variables: {
      address: address?.toString().toLocaleLowerCase(),
      ...paginationProps(page),
    },
    skip: !address,
  });

  const trees = query?.data?.tempTrees;

  useEffect(() => {
    (async function () {
      try {
        let storedTempTrees = await AsyncStorage.getItem(TreeFilter.Temp);
        if (storedTempTrees) {
          const _storedTempTrees = JSON.parse(storedTempTrees);
          setTempTrees(_storedTempTrees);
        }
      } catch (e) {
        console.log(e, 'Error inside ===> useTempTrees get');
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (trees !== undefined) {
        setTempTrees(trees);
        try {
          await AsyncStorage.setItem(TreeFilter.Temp, JSON.stringify(trees));
        } catch (e) {
          console.log(e, 'Error inside ===> useTempTrees set');
        }
      }
    })();
  }, [trees]);

  const refetchTempTrees = useCallback(async () => {
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

  return {tempTrees, tempTreesQuery: query, refetchTempTrees, refetching, loadMore};
}
