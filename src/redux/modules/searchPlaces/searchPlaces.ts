import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {takeEvery, put, call} from 'redux-saga/effects';
import axios from 'axios';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {searchLocationUrl} from 'utilities/helpers/searchLocationUrl';
import {TPlace, TPlaceForm} from 'components/Map/types';

const SearchPlaces = new ReduxFetchState<TPlace[] | null, TPlaceForm, any>('searchPlaces');

export type TUserSignAction = {
  type: string;
  payload: TPlaceForm;
};

export function* watchSearchPlaces(action: TUserSignAction) {
  try {
    const {search} = action.payload;
    if (!search) {
      yield put(SearchPlaces.actions.loadSuccess(null));
    } else {
      const {data} = yield call(() => axios.get(searchLocationUrl(search)));
      yield put(SearchPlaces.actions.loadSuccess(data.features));
    }
  } catch (e: any) {
    yield put(SearchPlaces.actions.loadFailure(e));
  }
}

export function* searchPlacesSagas() {
  yield takeEvery(SearchPlaces.actionTypes.load, watchSearchPlaces);
}

export function useSearchPlaces() {
  const {data, ...searchPlacesState} = useAppSelector(state => state.searchPlaces);
  const dispatch = useAppDispatch();

  const dispatchSearchPlaces = useCallback(
    (search: string) => {
      dispatch(SearchPlaces.actions.load({search}));
    },
    [dispatch],
  );

  const dispatchResetSearchPlaces = useCallback(() => {
    dispatch(SearchPlaces.actions.resetCache());
  }, [dispatch]);

  return {
    ...searchPlacesState,
    dispatchSearchPlaces,
    dispatchResetSearchPlaces,
    searchPlaces: data,
  };
}

export const {
  actionTypes: searchPlacesActionsTypes,
  actions: searchPlacesActions,
  reducer: searchPlacesReducer,
} = SearchPlaces;
