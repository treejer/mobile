import {useCallback} from 'react';
import {fetchUserRequest, TFetchUserRequest} from '../../redux/modules/user/user';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';

export const useCurrUser = () => {
  const user = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const handleFetchUserRequest = useCallback(
    (fetchData: TFetchUserRequest) => {
      dispatch(fetchUserRequest(fetchData));
    },
    [dispatch],
  );

  return {
    ...user,
    fetchUserRequest: handleFetchUserRequest,
  };
};
