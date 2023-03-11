import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {takeEvery, put, call} from 'redux-saga/effects';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {handleSagaFetchError} from 'utilities/helpers/fetch';
import {CountiesRes} from 'services/types';
import {NetworkConfig} from 'services/config';
import {selectConfig} from '../web3/web3';

const Countries = new ReduxFetchState<CountiesRes, null, string>('countries');

export function* watchCountries() {
  try {
    const {treejerApiUrl}: NetworkConfig = yield selectConfig();

    const res = yield call(() => fetch(`${treejerApiUrl}/resources/countries.min.json`));
    const data = yield res.json();
    yield put(Countries.actions.loadSuccess(data));
  } catch (e: any) {
    yield put(Countries.actions.loadFailure(e));
    yield handleSagaFetchError(e);
  }
}

export function* countriesSagas() {
  yield takeEvery(Countries.actionTypes.load, watchCountries);
}

export function useCountries() {
  const {data, ...countriesData} = useAppSelector(state => state.countries);
  const dispatch = useAppDispatch();

  const dispatchCountries = useCallback(() => {
    dispatch(Countries.actions.load());
  }, [dispatch]);

  return {
    ...countriesData,
    dispatchCountries,
    countries: data,
  };
}

export const {actionTypes: countriesActionsTypes, actions: countriesActions, reducer: countriesReducer} = Countries;
