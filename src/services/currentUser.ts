import {useQuery} from '@apollo/client';
import {useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import getMeQuery, {GetMeQueryData} from './graphql/GetMeQuery.graphql';

export enum UserStatus {
  Loading,
  Unverified,
  Pending,
  Verified,
}

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<GetMeQueryData.User | null>(null);
  const result = useQuery<GetMeQueryData>(getMeQuery, {
    fetchPolicy: 'cache-and-network',
  });

  const {data, error, loading, refetch} = result;
  // @ts-ignore
  const statusCode = error?.networkError?.result?.error?.statusCode;

  if (statusCode === 401) {
    // logout @here
  }

  useEffect(() => {
    (async function () {
      const localUser = await AsyncStorage.getItem('currentUser');
      if (localUser) {
        setCurrentUser(JSON.parse(localUser));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!loading && data) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(data.user));
        setCurrentUser(data.user);
      }
    })();
  }, [loading, data]);

  const refetchUser = useCallback(async () => {
    try {
      const newUser = await refetch();
      if (newUser?.data?.user) {
        setCurrentUser(newUser.data.user);
      }
    } catch (e) {
      console.log(e, 'e inside refetchUser');
    }
  }, [refetch]);

  const status: UserStatus = (() => {
    if (!currentUser) {
      return UserStatus.Loading;
    }
    if (!currentUser?.isVerified && !currentUser?.firstName) {
      return UserStatus.Unverified;
    }
    if (!currentUser.isVerified && currentUser?.firstName) {
      return UserStatus.Pending;
    }
    return UserStatus.Verified;
  })();

  return {
    ...result,
    status,
    statusCode,
    data: {
      user: currentUser,
    },
    refetchUser,
  };
}
