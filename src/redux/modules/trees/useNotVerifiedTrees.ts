import {useCallback} from 'react';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {plantedTreesActions} from './plantedTrees';
import {updatedTreesActions} from './updatedTrees';
import {assignedTreesActions} from './assignedTrees';
import {PaginationName, useReduxPagination} from 'ranger-redux/modules/pagination/pagination.reducer';

export function useNotVerifiedTrees() {
  const {data: plantedTrees, ...plantedTreesState} = useAppSelector(state => state.plantedTrees);
  const plantedTreesPagination = useReduxPagination(PaginationName.PlantedTrees);

  const {data: updatedTrees, ...updatedTreesState} = useAppSelector(state => state.updatedTrees);
  const updatedTreesPagination = useReduxPagination(PaginationName.UpdatedTrees);

  const {data: assignedTrees, ...assignedTreesState} = useAppSelector(state => state.assignedTree);
  const assignedTreesPagination = useReduxPagination(PaginationName.AssignedTrees);

  const dispatch = useAppDispatch();

  const dispatchGetAll = useCallback(() => {
    dispatch(plantedTreesActions.load());
    dispatch(updatedTreesActions.load());
    dispatch(assignedTreesActions.load());
  }, [dispatch]);

  const dispatchGetPlantedTrees = useCallback(() => {
    dispatch(plantedTreesActions.load());
  }, [dispatch]);

  const dispatchGetUpdatedTrees = useCallback(() => {
    dispatch(updatedTreesActions.load());
  }, [dispatch]);

  const dispatchGetAssignedTrees = useCallback(() => {
    dispatch(assignedTreesActions.load());
  }, [dispatch]);

  return {
    dispatchGetAll,
    planted: {
      plantedTrees,
      ...plantedTreesState,
      dispatchGetPlantedTrees,
      pagination: plantedTreesPagination,
    },
    updated: {
      updatedTrees,
      ...updatedTreesState,
      dispatchGetUpdatedTrees,
      updatedTreesPagination,
      pagination: updatedTreesPagination,
    },
    assigned: {
      assignedTrees,
      ...assignedTreesState,
      dispatchGetAssignedTrees,
      assignedTreesPagination,
      pagination: assignedTreesPagination,
    },
  };
}
