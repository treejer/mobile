import {PaginationName} from 'ranger-redux/modules/pagination/pagination.reducer';
import * as actionsList from 'ranger-redux/modules/pagination/pagination.action';
import {plantedTreesActions} from 'ranger-redux/modules/trees/plantedTrees';

describe('pagination actions', () => {
  it('set next page + query', () => {
    const expectedAction = {
      type: actionsList.SET_NEXT_PAGE,
      name: PaginationName.PlantedTrees,
      query: {filters: {signer: 'any', nonce: 1}},
      action: plantedTreesActions.load,
    };
    expect(
      actionsList.setNextPage(PaginationName.PlantedTrees, plantedTreesActions.load, {
        filters: {signer: 'any', nonce: 1},
      }),
    ).toEqual(expectedAction);
  });
  it('set next page', () => {
    const expectedAction = {
      type: actionsList.SET_NEXT_PAGE,
      name: PaginationName.PlantedTrees,
      action: plantedTreesActions.load,
    };
    expect(actionsList.setNextPage(PaginationName.PlantedTrees, plantedTreesActions.load)).toEqual(expectedAction);
  });
  it('pagination reached end', () => {
    const expectedAction = {
      type: actionsList.PAGINATION_REACHED_END,
      name: PaginationName.PlantedTrees,
    };
    expect(actionsList.paginationReachedEnd(PaginationName.PlantedTrees)).toEqual(expectedAction);
  });
  it('reset pagination', () => {
    const expectedAction = {
      type: actionsList.RESET_PAGINATION,
      name: PaginationName.PlantedTrees,
    };
    expect(actionsList.resetPagination(PaginationName.PlantedTrees)).toEqual(expectedAction);
  });
  it('set pagination total', () => {
    const expectedAction = {
      type: actionsList.SET_PAGINATION_TOTAL,
      name: PaginationName.PlantedTrees,
      total: 30,
    };
    expect(actionsList.setPaginationTotal(PaginationName.PlantedTrees, 30)).toEqual(expectedAction);
  });
});
