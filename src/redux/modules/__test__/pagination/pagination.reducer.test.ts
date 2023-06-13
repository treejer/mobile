import {
  defaultPaginationItem,
  PaginationName,
  paginationReducer,
} from 'ranger-redux/modules/pagination/pagination.reducer';
import * as actionsList from 'ranger-redux/modules/pagination/pagination.action';

describe('pagination reducer', () => {
  const initialState = {
    [PaginationName.PlantedTrees]: defaultPaginationItem,
    [PaginationName.UpdatedTrees]: defaultPaginationItem,
    [PaginationName.AssignedTrees]: defaultPaginationItem,
    [PaginationName.SubmittedTrees]: defaultPaginationItem,
  };
  it('should return the initial state', () => {
    expect(paginationReducer(initialState, {type: '', name: PaginationName.AssignedTrees})).toEqual(initialState);
  });
  it('should handle SET_NEXT_PAGE', () => {
    const expectedState = {
      ...initialState,
      [PaginationName.PlantedTrees]: {
        page: 1,
        perPage: 30,
        total: 0,
        hasMore: true,
        loading: true,
      },
    };
    expect(
      paginationReducer(initialState, {type: actionsList.SET_NEXT_PAGE, name: PaginationName.PlantedTrees}),
    ).toEqual(expectedState);
  });
  it('should handle SET_PAGINATION_TOTAL', () => {
    const expectedState = {
      ...initialState,
      [PaginationName.PlantedTrees]: {
        page: 0,
        perPage: 30,
        total: 34,
        hasMore: true,
        loading: false,
      },
    };
    expect(
      paginationReducer(initialState, {
        type: actionsList.SET_PAGINATION_TOTAL,
        name: PaginationName.PlantedTrees,
        total: 34,
      }),
    ).toEqual(expectedState);
  });
  it('should handle PAGINATION_REACHED_END', () => {
    const expectedState = {
      ...initialState,
      [PaginationName.PlantedTrees]: {
        page: 0,
        perPage: 30,
        total: 0,
        hasMore: false,
        loading: false,
      },
    };
    expect(
      paginationReducer(initialState, {
        type: actionsList.PAGINATION_REACHED_END,
        name: PaginationName.PlantedTrees,
      }),
    ).toEqual(expectedState);
  });
  it('should handle RESET_PAGINATION', () => {
    const state = {
      ...initialState,
      [PaginationName.PlantedTrees]: {
        page: 3,
        perPage: 30,
        total: 30,
        hasMore: false,
        loading: false,
      },
    };
    expect(paginationReducer(state, {type: actionsList.RESET_PAGINATION, name: PaginationName.PlantedTrees})).toEqual(
      initialState,
    );
  });
});
