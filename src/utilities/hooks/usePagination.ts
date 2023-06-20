import {Dispatch, useCallback, useEffect, useMemo, useState} from 'react';
import {NetworkStatus, OperationVariables, useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useProfile} from 'ranger-redux/modules/profile/profile';

export function usePagination<TQueryData, TVariables extends OperationVariables, TPersistedData>(
  Query: any,
  variables: TVariables,
  dataKey: string,
  storageKey: string,
  keepData?: boolean,
  manualPerPage?: number,
) {
  const {profile} = useProfile();
  const perPage = useMemo(() => manualPerPage || 30, []);
  const [page, setPage] = useState(0);

  const [persistedData, setPersistedData] = usePersistedData<TPersistedData>(storageKey);

  const [refetching, setRefetching] = useState(false);

  const paginationProps = useCallback(
    (newPage: number) => ({
      first: perPage,
      skip: newPage * perPage,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    }),
    [perPage],
  );

  const query = useQuery<TQueryData, TVariables>(Query, {
    variables: {
      ...variables,
      ...paginationProps(page),
    },
    skip: !variables || !profile,
  });

  useEffect(() => {
    (async function () {
      // console.log(query.data, 'data is here');
      if (query.data?.[dataKey] !== undefined) {
        if (keepData && page !== 0) {
          if (query.data?.[dataKey]?.length > 0) {
            // @ts-ignore
            setPersistedData([...persistedData, ...query.data[dataKey]]);
          }
        } else {
          setPersistedData(query.data[dataKey]);
        }
        try {
          await AsyncStorage.setItem(storageKey, JSON.stringify(query.data?.[dataKey]));
        } catch (e) {
          console.log(e, 'Error inside ===> usePagination set');
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey, query.data]);

  const refetchData = useCallback(
    async (newVariables?: TVariables, silent?: boolean) => {
      setPage(0);
      setRefetching(!silent);
      await query.refetch({
        ...(newVariables || variables),
        ...paginationProps(0),
      });
      setRefetching(false);
    },
    [variables, query, setPage, paginationProps],
  );

  // const refetching = query.networkStatus === NetworkStatus.refetch;

  const loadMore = useCallback(async () => {
    const newPage = page + 1;
    try {
      await query.fetchMore({
        variables: {
          ...variables,
          ...paginationProps(newPage),
        },
      });
      setPage(newPage);
    } catch (e) {
      console.log(e, 'e is here loadMore');
    }
  }, [variables, page, paginationProps, query]);

  const resetPagination = useCallback(() => {
    setPage(0);
  }, []);

  return {persistedData, query, loading: query.loading, refetchData, refetching, loadMore, resetPagination, page};
}

export function usePersistedData<TData>(storageKey: string): [TData | null, Dispatch<TData | null>] {
  const [data, setData] = useState<TData | null>(null);

  useEffect(() => {
    (async function () {
      try {
        let storedData = await AsyncStorage.getItem(storageKey);
        if (storedData) {
          const _storedData = JSON.parse(storedData);
          setData(_storedData);
        }
      } catch (e) {
        console.log(e, 'Error inside ===> usePersistedData get');
      }
    })();
  }, []);

  return [data, setData];
}
