import {useCallback, useEffect, useMemo} from 'react';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {NotVerifiedTreeStatus} from 'utilities/helpers/treeInventory';
import {plantedTreesActions} from './plantedTrees';
import {updatedTreesActions} from './updatedTrees';
import {assignedTreesActions} from './assignedTrees';
import {PaginationName, useReduxPagination} from 'ranger-redux/modules/pagination/pagination.reducer';

export function useNotVerifiedTrees(status: NotVerifiedTreeStatus = NotVerifiedTreeStatus.Plant) {
  const {data: plantedTrees, ...plantedTreesState} = useAppSelector(state => state.plantedTrees);
  const plantedTreesPagination = useReduxPagination(PaginationName.PlantedTrees);

  const {data: updatedTrees, ...updatedTreesState} = useAppSelector(state => state.updatedTrees);
  const updatedTreesPagination = useReduxPagination(PaginationName.UpdatedTrees);

  const {data: assignedTrees, ...assignedTreesState} = useAppSelector(state => state.assignedTrees);
  const assignedTreesPagination = useReduxPagination(PaginationName.AssignedTrees);

  const dispatch = useAppDispatch();

  const dispatchGetAll = useCallback(() => {
    dispatch(plantedTreesActions.load());
    dispatch(updatedTreesActions.load());
    dispatch(assignedTreesActions.load());
  }, [dispatch]);

  useEffect(() => {
    dispatchGetAll();
  }, []);

  const dispatchGetPlantedTrees = useCallback(() => {
    dispatch(plantedTreesActions.load());
  }, [dispatch]);

  const dispatchGetUpdatedTrees = useCallback(() => {
    dispatch(updatedTreesActions.load());
  }, [dispatch]);

  const dispatchGetAssignedTrees = useCallback(() => {
    dispatch(assignedTreesActions.load());
  }, [dispatch]);

  const planted = useMemo(
    () => ({
      trees: plantedTrees,
      ...plantedTreesState,
      refetching: plantedTrees?.data && plantedTreesState.loading,
      dispatchRefetch: () => {
        plantedTreesPagination.dispatchResetPagination();
        dispatchGetPlantedTrees();
      },
      dispatchLoadMore: () => plantedTreesPagination.dispatchNextPage(plantedTreesActions.load),
      pagination: plantedTreesPagination,
    }),
    [plantedTrees, plantedTreesState, plantedTreesPagination, dispatchGetPlantedTrees],
  );

  const updated = useMemo(
    () => ({
      trees: updatedTrees,
      ...updatedTreesState,
      refetching: updatedTrees?.data && updatedTreesState.loading,
      dispatchRefetch: () => {
        updatedTreesPagination.dispatchResetPagination();
        dispatchGetUpdatedTrees();
      },
      dispatchLoadMore: () => updatedTreesPagination.dispatchNextPage(updatedTreesActions.load),
      pagination: updatedTreesPagination,
    }),
    [updatedTrees, updatedTreesState, updatedTreesPagination, dispatchGetUpdatedTrees],
  );

  const assigned = useMemo(
    () => ({
      trees: assignedTrees,
      ...assignedTreesState,
      refetching: assignedTrees?.data && assignedTreesState.loading,
      dispatchRefetch: () => {
        assignedTreesPagination.dispatchResetPagination();
        dispatchGetAssignedTrees();
      },
      dispatchLoadMore: () => assignedTreesPagination.dispatchNextPage(assignedTreesActions.load),
      pagination: assignedTreesPagination,
    }),
    [assignedTrees, assignedTreesState, assignedTreesPagination, dispatchGetAssignedTrees],
  );

  const current = useMemo(() => {
    if (status === NotVerifiedTreeStatus.Plant) {
      return planted;
    } else if (status === NotVerifiedTreeStatus.Update) {
      return updated;
    } else {
      return assigned;
    }
  }, [status, planted, updated, assigned]);

  return {
    dispatchGetAll,
    current,
    planted,
    updated,
    assigned,
  };
}
