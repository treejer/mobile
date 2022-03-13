import React, {useCallback, useEffect, useMemo, useReducer} from 'react';
import {TreeJourney} from 'screens/TreeSubmission/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {storageKeys} from 'services/config';

export const offlineTreesStorageKey = storageKeys.offlineTrees;
export const offlineUpdatedTreesStorageKey = storageKeys.offlineUpdatedTrees;

export interface OfflineTreesState {
  planted: TreeJourney[] | null;
  updated: TreeJourney[] | null;
}

const initialState: OfflineTreesState = {
  planted: null,
  updated: null,
};

export const INIT_OFFLINE_TREES = 'INIT_OFFLINE_TREES';
export const initOfflineTrees = (trees, updatedTrees) => ({
  type: INIT_OFFLINE_TREES,
  trees,
  updatedTrees,
});

export const ADD_OFFLINE_TREE = 'ADD_OFFLINE_TREE';
export const addOfflineTree = (tree: TreeJourney) => ({
  type: ADD_OFFLINE_TREE,
  tree,
});

export const ADD_OFFLINE_TREES = 'ADD_OFFLINE_TREES';
export const addOfflineTrees = (trees: TreeJourney[]) => ({
  type: ADD_OFFLINE_TREES,
  trees,
});

export const REMOVE_OFFLINE_TREE = 'REMOVE_OFFLINE_TREE';
export const removeOfflineTree = (id: string) => ({
  type: REMOVE_OFFLINE_TREE,
  id,
});

export const ADD_OFFLINE_UPDATE_TREE = 'ADD_OFFLINE_UPDATE_TREE';
export const addOfflineUpdateTree = (tree: TreeJourney) => ({
  type: ADD_OFFLINE_UPDATE_TREE,
  tree,
});

export const REMOVE_OFFLINE_UPDATE_TREE = 'REMOVE_OFFLINE_UPDATE_TREE';
export const removeOfflineUpdateTree = (id: string) => ({
  type: REMOVE_OFFLINE_UPDATE_TREE,
  id,
});

export const RESET_OFFLINE_TREES = 'RESET_OFFLINE_TREES';
export const resetOfflineTrees = () => ({
  type: RESET_OFFLINE_TREES,
});

function reducer(state: OfflineTreesState, action) {
  switch (action.type) {
    case INIT_OFFLINE_TREES:
      return {
        ...state,
        planted: action.trees || null,
        updated: action.updatedTrees || null,
      };
    case ADD_OFFLINE_TREE:
      return {
        ...state,
        planted:
          state.planted === null
            ? [action.tree]
            : [
                ...state.planted.filter(item => {
                  if (item.treeIdToPlant) {
                    return item.treeIdToPlant !== action.tree.treeIdToPlant;
                  }
                  return item;
                }),
                action.tree,
              ],
      };
    case ADD_OFFLINE_TREES:
      return {
        ...state,
        planted: state.planted === null ? [...action.trees] : [...state.planted, ...action.trees],
      };
    case REMOVE_OFFLINE_TREE:
      return {
        ...state,
        planted: state.planted === null ? null : state.planted.filter(item => item.offlineId !== action.id),
      };
    case ADD_OFFLINE_UPDATE_TREE:
      return {
        ...state,
        updated:
          state.updated === null
            ? [action.tree]
            : [...state.updated.filter(item => item.treeIdToUpdate !== action.tree.treeIdToUpdate), action.tree],
      };
    case REMOVE_OFFLINE_UPDATE_TREE:
      return {
        ...state,
        updated: state.updated === null ? null : state.updated.filter(item => item.treeIdToUpdate !== action.id),
      };
    case RESET_OFFLINE_TREES:
      return initialState;
    default:
      throw new Error(`${action.type}, is not a valid action`);
  }
}

export const OfflineTressContext = React.createContext(null);

export function OfflineTreeProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async function () {
      try {
        let storedOfflineTrees = await AsyncStorage.getItem(offlineTreesStorageKey);
        let storedOfflineUpdatedTress = await AsyncStorage.getItem(offlineUpdatedTreesStorageKey);
        if (storedOfflineTrees) {
          storedOfflineTrees = JSON.parse(storedOfflineTrees);
        }
        if (storedOfflineUpdatedTress) {
          storedOfflineUpdatedTress = JSON.parse(storedOfflineUpdatedTress);
        }
        dispatch(initOfflineTrees(storedOfflineTrees, storedOfflineUpdatedTress));
      } catch (e) {
        console.log(e, 'e inside init useOfflineTrees');
      }
    })();
  }, []);

  useEffect(() => {
    (async function () {
      try {
        if (state.planted === null) {
          await AsyncStorage.removeItem(offlineTreesStorageKey);
        } else {
          await AsyncStorage.setItem(offlineTreesStorageKey, JSON.stringify(state.planted));
        }
        if (state.updated === null) {
          await AsyncStorage.removeItem(offlineUpdatedTreesStorageKey);
        } else {
          await AsyncStorage.setItem(offlineUpdatedTreesStorageKey, JSON.stringify(state.updated));
        }
      } catch (e) {
        console.log(e, 'e inside set new state offlineTrees');
      }
    })();
  }, [state]);

  const dispatchAddOfflineTree = useCallback(
    (tree: TreeJourney) => {
      dispatch(
        addOfflineTree({
          ...tree,
          offlineId: Date.now().toString(),
        }),
      );
    },
    [dispatch],
  );

  const dispatchAddOfflineTrees = useCallback(
    (trees: TreeJourney[]) => {
      dispatch(addOfflineTrees(trees));
    },
    [dispatch],
  );

  const dispatchRemoveOfflineTree = useCallback(
    (id: string) => {
      dispatch(removeOfflineTree(id));
    },
    [dispatch],
  );

  const dispatchAddOfflineUpdateTree = useCallback(
    (tree: TreeJourney) => {
      dispatch(addOfflineUpdateTree(tree));
    },
    [dispatch],
  );

  const dispatchRemoveOfflineUpdateTree = useCallback(
    (id: string) => {
      dispatch(removeOfflineUpdateTree(id));
    },
    [dispatch],
  );

  const dispatchResetOfflineTrees = useCallback(() => {
    dispatch(resetOfflineTrees());
  }, []);

  const value = useMemo(
    () => ({
      offlineTrees: state,
      dispatch,
      dispatchAddOfflineTree,
      dispatchAddOfflineTrees,
      dispatchRemoveOfflineTree,
      dispatchAddOfflineUpdateTree,
      dispatchRemoveOfflineUpdateTree,
      dispatchResetOfflineTrees,
    }),
    [
      dispatchAddOfflineTree,
      dispatchAddOfflineTrees,
      dispatchAddOfflineUpdateTree,
      dispatchRemoveOfflineTree,
      dispatchRemoveOfflineUpdateTree,
      state,
      dispatchResetOfflineTrees,
    ],
  );

  return <OfflineTressContext.Provider value={value}>{children}</OfflineTressContext.Provider>;
}

export function useOfflineTrees() {
  return React.useContext(OfflineTressContext);
}
