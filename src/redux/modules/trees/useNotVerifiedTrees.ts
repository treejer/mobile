import {useCallback} from 'react';

import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {plantedTreesActions} from './plantedTrees';
import {updatedTreesActions} from './updatedTrees';
import {assignedTreesActions} from './assignedTrees';

export function useNotVerifiedTrees() {
  const {data: plantedTrees, ...plantedTreesState} = useAppSelector(state => state.plantedTrees);
  const {data: updatedTrees, ...updatedTreesState} = useAppSelector(state => state.updatedTrees);
  const {data: assignedTrees, ...assignedTreesState} = useAppSelector(state => state.assignedTree);
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
    },
    updated: {
      updatedTrees,
      ...updatedTreesState,
      dispatchGetUpdatedTrees,
    },
    assigned: {
      assignedTrees,
      ...assignedTreesState,
      dispatchGetAssignedTrees,
    },
  };
}
