import {useEffect, useState} from 'react';
import axios, {AxiosError, AxiosRequestHeaders} from 'axios';
import {useConfig} from 'services/web3';

export type TResult<TData> = {
  data: TData | null;
  loading: boolean;
  error: any;
};

export const useFetch = <TData>(endPoint: string, headers?: AxiosRequestHeaders) => {
  const [result, setResult] = useState<TResult<TData>>({
    data: null,
    loading: true,
    error: null,
  });
  const {treejerApiUrl} = useConfig();
  const header = {headers} || undefined;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setResult({...result, loading: true});
    try {
      // ? axios.defaults.baseURL = treejerApiUrl;
      const {data} = await axios.get(treejerApiUrl + endPoint, header);
      setResult({...result, data, loading: false});
    } catch (error: any) {
      setResult({...result, error, loading: false});
    }
  };

  const refetch = async () => {
    setResult({...result, loading: true});

    try {
      const {data} = await axios.get(treejerApiUrl + endPoint, header);

      setResult({...result, data, loading: false});
      return {data};
    } catch (error: any) {
      setResult({...result, error, loading: false});
      return {error};
    }
  };

  return {...result, refetch};
};
