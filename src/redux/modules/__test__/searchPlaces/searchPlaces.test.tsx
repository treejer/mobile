import assert from 'assert';
import {put, takeEvery} from 'redux-saga/effects';
import {renderHook} from '@testing-library/react-hooks';
import {AllTheProviders} from 'ranger-testUtils/testingLibrary';

import {
  searchPlacesActions,
  searchPlacesActionsTypes,
  searchPlacesReducer,
  searchPlacesSagas,
  useSearchPlaces,
  watchSearchPlaces,
} from 'ranger-redux/modules/searchPlaces/searchPlaces';

const newPlace = {
  center: [1, 2],
  geometry: {
    coordinates: [1, 2],
  },
  id: 'ID',
  place_name: 'Place',
  relevance: 2,
  text: 'TEXT',
  string: 'STRING',
  type: 'TYPE',
};

describe('searchPlaces module', () => {
  it('searchPlaces module should be defined', () => {
    expect(searchPlacesReducer).toBeDefined();
    expect(searchPlacesActions).toBeDefined();
    expect(searchPlacesActionsTypes).toBeDefined();
  });

  describe('searchPlaces saga', () => {
    it('searchPlaces saga should be defined ', () => {
      expect(searchPlacesSagas).toBeDefined();
    });
    it('searchPlaces sagas should yield searchPlaces watcher', () => {
      const gen = searchPlacesSagas();
      assert.deepEqual(gen.next().value, takeEvery(searchPlacesActionsTypes.load, watchSearchPlaces));
    });
  });

  describe('watchSearchPlaces', () => {
    it('watchSearchPlaces should be defined', () => {
      expect(watchSearchPlaces).toBeDefined();
    });
    it('watchSearchPlaces success empty search payload', () => {
      const gen = watchSearchPlaces({type: searchPlacesActionsTypes.load, payload: {search: ''}});
      assert.deepEqual(gen.next().value, put(searchPlacesActions.loadSuccess(null)));
      assert.deepEqual(gen.next().value, undefined);
    });
    it('watchSearchPlaces success', () => {
      const gen = watchSearchPlaces({type: searchPlacesActionsTypes.load, payload: {search: 'city'}});
      gen.next();
      assert.deepEqual(
        gen.next({data: {features: [newPlace]}}).value,
        put(searchPlacesActions.loadSuccess([newPlace])),
      );
    });
    it('watchSearchPlaces failure', () => {
      const gen = watchSearchPlaces({type: searchPlacesActionsTypes.load, payload: {search: 'city'}});
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(gen.throw(error).value, put(searchPlacesActions.loadFailure(error)));
    });
  });

  describe('searchPlaces hooks', () => {
    const {result} = renderHook(() => useSearchPlaces(), {
      wrapper: props => <AllTheProviders {...(props as any)} initialState={{searchPlaces: {data: [newPlace]}}} />,
    });

    it('should return state', () => {
      expect(result.current.searchPlaces).toEqual([newPlace]);
    });
  });
});
