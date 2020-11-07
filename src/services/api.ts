import {useCallback, useEffect, useState} from 'react';
import {useAccessToken} from 'services/web3';

interface GetMeRequest {
  type: 'GetMe';
}

interface GetMeResponse {
  test: string;
}

type TreejerRequest = GetMeRequest;

const fetchOptions = {
  GetMe: (request: GetMeRequest) => {
    return [
      'users/me',
      {
        method: 'GET',
      },
    ] as const;
  },
};

function useApi<T extends TreejerRequest>(request: T) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Object>(undefined);
  const [error, setError] = useState<Error>(undefined);
  const accessToken = useAccessToken();

  const callApi = useCallback(async () => {
    try {
      const [url, options] = fetchOptions[request.type](request);
      const response = await fetch(url, {
        ...options,
      });
      const result = await response.json();
      setData(result);
      setError(undefined);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(request), accessToken]);

  useEffect(() => {
    callApi();
  }, [callApi]);

  return {
    loading,
    error,
    refetch: callApi,
    data,
  };
}

export default useApi;
