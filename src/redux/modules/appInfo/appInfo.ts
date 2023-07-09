import {useCallback} from 'react';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {TReduxState} from 'ranger-redux/store';
import {version} from '../../../../package.json';

export const CHECK_APP_VERSION = 'CHECK_APP_VERSION';
export const checkAppVersion = () => ({
  type: CHECK_APP_VERSION,
});

export type AppInfoState = {
  version: string;
};

export const appInfoInitialState: AppInfoState = {
  version,
};

export const appInfoReducer = (state: AppInfoState = appInfoInitialState) => {
  return state;
};

export const getAppVersion = (state: TReduxState) => state.appInfo.version;

export function useAppInfo() {
  const appInfo = useAppSelector(state => state.appInfo);
  const dispatch = useAppDispatch();

  const dispatchCheckAppVersion = useCallback(() => {
    dispatch(checkAppVersion());
  }, [dispatch]);

  return {
    appInfo,
    dispatchCheckAppVersion,
  };
}
