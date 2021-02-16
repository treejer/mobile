import {useQuery} from '@apollo/react-hooks';

import getMeQuery, {GetMeQueryData} from './graphql/GetMeQuery.graphql';

export enum UserStatus {
  Loading,
  Unverified,
  Pending,
  Verified,
}

export function useCurrentUser() {
  const result = useQuery<GetMeQueryData>(getMeQuery, {
    fetchPolicy: 'cache-and-network',
  });

  const {data} = result;

  const status: UserStatus = (() => {
    if (!data?.me) {
      return UserStatus.Loading;
    }
    if (!data.me.isVerified && !data.me.name) {
      return UserStatus.Unverified;
    }
    if (!data.me.isVerified && data.me.name) {
      return UserStatus.Pending;
    }
    return UserStatus.Verified;
  })();

  return {
    ...result,
    status,
  };
}
