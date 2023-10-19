import {useCallback, useEffect, useMemo} from 'react';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {NotVerifiedTreeStatus} from 'utilities/helpers/treeInventory';
import {plantedTreesActions} from './plantedTrees';
import {updatedTreesActions} from './updatedTrees';
import {assignedTreesActions} from './assignedTrees';
import {PaginationName, useReduxPagination} from 'ranger-redux/modules/pagination/pagination.reducer';
import {TPlantedTreesPayload} from 'webServices/trees/plantedTrees';
import {TUpdatedTreesPayload} from 'webServices/trees/updatedTrees';
import {TAssignedTreesPayload} from 'webServices/trees/assignedTrees';

export function useNotVerifiedTrees(
  fetchOnMount?: boolean,
  showAlert?: boolean,
  status: NotVerifiedTreeStatus = NotVerifiedTreeStatus.Plant,
) {
  const {data: plantedTrees, ...plantedTreesState} = useAppSelector(state => state.plantedTrees);
  const plantedTreesPagination = useReduxPagination(PaginationName.PlantedTrees);

  const {data: updatedTrees, ...updatedTreesState} = useAppSelector(state => state.updatedTrees);
  const updatedTreesPagination = useReduxPagination(PaginationName.UpdatedTrees);

  const {data: assignedTrees, ...assignedTreesState} = useAppSelector(state => state.assignedTrees);
  const assignedTreesPagination = useReduxPagination(PaginationName.AssignedTrees);

  const dispatch = useAppDispatch();

  const dispatchGetAll = useCallback(() => {
    dispatch(plantedTreesActions.load({showError: showAlert}));
    dispatch(updatedTreesActions.load({showError: false}));
    dispatch(assignedTreesActions.load({showError: false}));
  }, [dispatch]);

  useEffect(() => {
    if (fetchOnMount) {
      dispatchGetAll();
    }
  }, []);

  const dispatchGetPlantedTrees = useCallback(
    (form?: TPlantedTreesPayload) => {
      dispatch(plantedTreesActions.load(form));
    },
    [dispatch],
  );

  const dispatchResetPlantedTrees = useCallback(() => {
    dispatch(plantedTreesActions.resetCache());
  }, [dispatch]);

  const dispatchGetUpdatedTrees = useCallback(
    (form?: TUpdatedTreesPayload) => {
      dispatch(updatedTreesActions.load(form));
    },
    [dispatch],
  );

  const dispatchResetUpdatedTrees = useCallback(() => {
    dispatch(updatedTreesActions.resetCache());
  }, [dispatch]);

  const dispatchGetAssignedTrees = useCallback(
    (form?: TAssignedTreesPayload) => {
      dispatch(assignedTreesActions.load(form));
    },
    [dispatch],
  );

  const dispatchResetAssignedTrees = useCallback(() => {
    dispatch(assignedTreesActions.resetCache());
  }, [dispatch]);

  const dispatchResetAll = useCallback(() => {
    dispatchResetPlantedTrees();
    dispatchResetUpdatedTrees();
    dispatchResetAssignedTrees();
  }, [dispatchResetAssignedTrees, dispatchResetUpdatedTrees]);

  const planted = useMemo(
    () => ({
      trees: plantedTrees,
      ...plantedTreesState,
      refetching: !!plantedTrees?.data && plantedTreesState.loading,
      dispatchRefetch: (form?: TPlantedTreesPayload) =>
        new Promise((resolve, reject) => {
          plantedTreesPagination.dispatchResetPagination();
          dispatchGetPlantedTrees({...form, resolve, reject});
        }),
      dispatchLoadMore: () => plantedTreesPagination.dispatchNextPage(plantedTreesActions.load),
      pagination: plantedTreesPagination,
      reset: dispatchResetPlantedTrees,
    }),
    [plantedTrees, plantedTreesState, plantedTreesPagination, dispatchGetPlantedTrees, dispatchResetPlantedTrees],
  );

  const updated = useMemo(
    () => ({
      trees: updatedTrees,
      ...updatedTreesState,
      refetching: !!updatedTrees?.data && updatedTreesState.loading,
      dispatchRefetch: (form?: TUpdatedTreesPayload) =>
        new Promise((resolve, reject) => {
          updatedTreesPagination.dispatchResetPagination();
          dispatchGetUpdatedTrees({...form, resolve, reject});
        }),
      dispatchLoadMore: () => updatedTreesPagination.dispatchNextPage(updatedTreesActions.load),
      pagination: updatedTreesPagination,
      reset: dispatchResetUpdatedTrees,
    }),
    [updatedTrees, updatedTreesState, updatedTreesPagination, dispatchGetUpdatedTrees, dispatchResetUpdatedTrees],
  );

  const assigned = useMemo(
    () => ({
      trees: assignedTrees,
      ...assignedTreesState,
      refetching: !!assignedTrees?.data && assignedTreesState.loading,
      dispatchRefetch: (form?: TAssignedTreesPayload) =>
        new Promise((resolve, reject) => {
          assignedTreesPagination.dispatchResetPagination();
          dispatchGetAssignedTrees({...form, resolve, reject});
        }),
      dispatchLoadMore: () => assignedTreesPagination.dispatchNextPage(assignedTreesActions.load),
      pagination: assignedTreesPagination,
      reset: dispatchResetAssignedTrees,
    }),
    [assignedTrees, assignedTreesState, assignedTreesPagination, dispatchGetAssignedTrees, dispatchResetAssignedTrees],
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
    dispatchResetAll,
    current,
    planted,
    updated,
    assigned,
  };
}
