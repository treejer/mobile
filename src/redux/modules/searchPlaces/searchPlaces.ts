import {useCallback} from 'react';
import ReduxFetchState from 'redux-fetch-state';
import {takeEvery, put, call} from 'redux-saga/effects';
import axios from 'axios';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {TPlace, TPlaceForm} from 'components/Map/types';
import {mapboxPublicToken} from 'services/config';

const SearchPlaces = new ReduxFetchState<TPlace[] | null, TPlaceForm, string>('searchPlaces');

export type TUserSignAction = {
  type: string;
  payload: TPlaceForm;
};

export function* watchSearchPlaces(action: TUserSignAction) {
  try {
    const {search} = action.payload;
    if (!search) {
      yield put(SearchPlaces.actions.loadSuccess(null));
    }

    const {data} = yield call(() =>
      axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?proximity=ip&access_token=${mapboxPublicToken}`,
      ),
    );
    yield put(SearchPlaces.actions.loadSuccess(data.features));
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
