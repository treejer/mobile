import {renderHook} from '@testing-library/react-hooks';
import {AllTheProviders} from 'ranger-testUtils/testingLibrary';

import * as recentPlaces from '../../recentPlaces/recentPlaces';

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

describe('recentPlaces actions', () => {
  it('add new place', () => {
    const expectedAction = {
      type: recentPlaces.ADD_NEW_PLACE,
      newPlace,
    };
    expect(recentPlaces.addNewPlace(newPlace)).toEqual(expectedAction);
  });
  it('reset recent places', () => {
    const expectedAction = {
      type: recentPlaces.RESET_RECENT_PLACES,
    };
    expect(recentPlaces.resetRecentPlaces()).toEqual(expectedAction);
  });
});

describe('recentPlaces reducer', () => {
  const initialState = {recentPlaces: []};
  it('should return initialState', () => {
    expect(recentPlaces.recentPlacesReducer(initialState, {type: ''})).toEqual(initialState);
  });

  it('should handle ADD_NEW_PLACE', () => {
    const expectedState = {
      recentPlaces: [newPlace],
    };
    expect(recentPlaces.recentPlacesReducer(initialState, recentPlaces.addNewPlace(newPlace))).toEqual(expectedState);
  });
  it('should handle ADD_NEW_PLACE (exist place)', () => {
    const initialState = {recentPlaces: [newPlace]};
    const expectedState = {
      recentPlaces: [newPlace],
    };
    expect(recentPlaces.recentPlacesReducer(initialState, recentPlaces.addNewPlace(newPlace))).toEqual(expectedState);
  });
  it('should handle ADD_NEW_PLACE (full list)', () => {
    const mockRecentPlaces = Array.from(Array(15).keys()).map(item => ({...newPlace, id: `${item}`}));
    const initialState = {recentPlaces: mockRecentPlaces};
    mockRecentPlaces.pop();
    const expectedState = {
      recentPlaces: [newPlace, ...mockRecentPlaces],
    };
    expect(recentPlaces.recentPlacesReducer(initialState, recentPlaces.addNewPlace(newPlace))).toEqual(expectedState);
  });
  it('should handle RESET_RECENT_PLACES', () => {
    const initialState = {
      recentPlaces: [newPlace],
    };
    const expectedState = {
      recentPlaces: null,
    };
    expect(recentPlaces.recentPlacesReducer(initialState, recentPlaces.resetRecentPlaces())).toEqual(expectedState);
  });
});

describe('recentPlaces hook', () => {
  const {result} = renderHook(() => recentPlaces.useRecentPlaces(), {
    wrapper: props => <AllTheProviders {...(props as any)} initialState={{recentPlaces: {recentPlaces: [newPlace]}}} />,
  });

  it('should return state value', () => {
    expect(result.current.recentPlaces).toEqual([newPlace]);
  });
});
