import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {useCallback} from 'react';

export const SET_TOKEN = 'SET_TOKEN';
export const setToken = (payload: string) => ({
  type: SET_TOKEN,
  payload,
});

export const REMOVE_TOKEN = 'REMOVE_TOKEN';
export const removeToken = () => ({
  type: REMOVE_TOKEN,
});

export type Action = {
  type: string;
  payload: string;
};

export type TokenState = {
  token: string | null;
};

export const tokenInitialState: TokenState = {
  token: null,
};

export function tokenReducer(state: TokenState = tokenInitialState, action: Action) {
  switch (action.type) {
    case SET_TOKEN:
      return {
        token: action.payload,
      };
    case REMOVE_TOKEN:
      return tokenInitialState;
    default:
      return state;
  }
}

export function useToken() {
  const {token} = useAppSelector(state => state.token);
  const dispatch = useAppDispatch();

  const dispatchSetToken = useCallback(
    (newToken: string) => {
      dispatch(setToken(newToken));
    },
    [dispatch],
  );

  const dispatchRemoveToken = useCallback(() => {
    dispatch(removeToken());
  }, [dispatch]);

  return {
    token,
    dispatchSetToken,
    dispatchRemoveToken,
  };
}
