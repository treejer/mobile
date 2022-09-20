import React, {useCallback, useEffect, useMemo, useReducer, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';

import {Tree} from 'types';
import {TreeJourney} from 'screens/TreeSubmission/types';
import {ContractType, storageKeys} from 'services/config';
import {upload, uploadContent} from 'utilities/helpers/IPFS';
import {assignedTreeJSON, newTreeJSON, photoToUpload, updateTreeJSON} from 'utilities/helpers/submitTree';
import {sendTransactionWithGSN} from 'utilities/helpers/sendTransaction';
import {Hex2Dec} from 'utilities/helpers/hex';
import {useSettings} from 'utilities/hooks/useSettings';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {useConfig, useWalletAccount, useWeb3} from '../../redux/modules/web3/web3';

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

export type OfflineTreeContextValue = {
  offlineTrees: OfflineTreesState;
  dispatch: (action: any) => void;
  dispatchAddOfflineTree: (tree: TreeJourney) => void;
  dispatchAddOfflineTrees: (tree: TreeJourney[]) => void;
  dispatchRemoveOfflineTree: (id: string) => void;
  dispatchAddOfflineUpdateTree: (tree: TreeJourney) => void;
  dispatchRemoveOfflineUpdateTree: (id: string) => void;
  dispatchResetOfflineTrees: () => void;
  offlineLoadings: string[];
  offlineUpdateLoadings: string[];
  loadingMinimized: boolean;
  setOfflineLoadings: (loading: string[]) => void;
  setOfflineUpdateLoadings: (loading: string[]) => void;
  setLoadingMinimized: (loading: boolean) => void;
  handleSubmitOfflineAssignedTree: (journey: TreeJourney) => void;
  handleSubmitOfflineTree: (journey: TreeJourney) => void;
  handleUpdateOfflineTree: (treeJourney: Tree & TreeJourney) => void;
  handleSendAllOffline: (trees: TreeJourney[] | Tree[], isPlanted: boolean) => void;
};

export const initialContextValue: OfflineTreeContextValue = {
  offlineTrees: initialState,
  dispatch: () => {},
  dispatchAddOfflineTree: () => {},
  dispatchAddOfflineTrees: () => {},
  dispatchRemoveOfflineTree: () => {},
  dispatchAddOfflineUpdateTree: () => {},
  dispatchRemoveOfflineUpdateTree: () => {},
  dispatchResetOfflineTrees: () => {},
  offlineLoadings: [],
  offlineUpdateLoadings: [],
  loadingMinimized: false,
  setOfflineLoadings: () => {},
  setOfflineUpdateLoadings: () => {},
  setLoadingMinimized: () => {},
  handleSubmitOfflineAssignedTree: () => {},
  handleSubmitOfflineTree: () => {},
  handleUpdateOfflineTree: () => {},
  handleSendAllOffline: () => {},
};

export const OfflineTressContext = React.createContext<OfflineTreeContextValue>(initialContextValue);

export function OfflineTreeProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [offlineLoadings, setOfflineLoadings] = useState<string[]>([]);
  const [offlineUpdateLoadings, setOfflineUpdateLoadings] = useState<string[]>([]);
  const [loadingMinimized, setLoadingMinimized] = useState<boolean>(false);

  const address = useWalletAccount();
  const config = useConfig();
  const {t} = useTranslation();
  const {useGSN} = useSettings();
  const web3 = useWeb3();
  const isConnected = useNetInfoConnected();

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
      } catch (error: any) {
        console.log(error, 'e inside init useOfflineTrees');
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
      } catch (error: any) {
        console.log(error, 'e inside set new state offlineTrees');
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

  const handleUpdateOfflineTree = useCallback(
    async (treeJourney: Tree & TreeJourney) => {
      if (
        treeJourney?.treeSpecsEntity == null ||
        typeof treeJourney?.treeSpecsEntity === 'undefined' ||
        !treeJourney.treeIdToUpdate ||
        !treeJourney.tree ||
        !treeJourney.photo
      ) {
        Alert.alert(t('cannotUpdateTree'));
        return;
      }
      setOfflineUpdateLoadings([...offlineUpdateLoadings, treeJourney.treeIdToUpdate]);
      try {
        const photoUploadResult = await upload(config.ipfsPostURL, photoToUpload(treeJourney.photo));

        const jsonData = updateTreeJSON(config.ipfsGetURL, {
          tree: treeJourney.tree,
          journey: treeJourney,
          photoUploadHash: photoUploadResult.Hash,
        });

        const metaDataUploadResult = await uploadContent(config.ipfsPostURL, JSON.stringify(jsonData));

        console.log(metaDataUploadResult.Hash, 'metaDataUploadResult.Hash');

        const receipt = await sendTransactionWithGSN(
          config,
          ContractType.TreeFactory,
          web3,
          address,
          'updateTree',
          [treeJourney.treeIdToUpdate, metaDataUploadResult.Hash],
          useGSN,
        );
        dispatchRemoveOfflineUpdateTree(treeJourney.treeIdToUpdate);
        setOfflineUpdateLoadings(offlineUpdateLoadings.filter(id => id !== treeJourney.treeIdToUpdate));
      } catch (error: any) {
        setOfflineUpdateLoadings(offlineUpdateLoadings.filter(id => id !== treeJourney.treeIdToUpdate));
        Alert.alert(
          t('transactionFailed.title'),
          error?.message || error?.error?.message || t('transactionFailed.tryAgain'),
        );
      }
      setOfflineUpdateLoadings(offlineUpdateLoadings.filter(id => id !== treeJourney.treeIdToUpdate));
    },
    [address, config, dispatchRemoveOfflineUpdateTree, offlineUpdateLoadings, t, useGSN, web3],
  );

  const handleSubmitOfflineAssignedTree = useCallback(
    async (journey: TreeJourney) => {
      if (!isConnected) {
        Alert.alert(t('noInternet'), t('submitWhenOnline'));
        return;
      }
      if (!journey.offlineId || !journey?.tree || !journey.treeIdToPlant || !journey.photo) {
        return;
      }
      try {
        setOfflineLoadings([...offlineLoadings, journey.offlineId]);
        const photoUploadResult = await upload(config.ipfsPostURL, photoToUpload(journey.photo));

        const jsonData = assignedTreeJSON(config.ipfsGetURL, {
          journey,
          tree: journey.tree,
          photoUploadHash: photoUploadResult.Hash,
        });

        const metaDataUploadResult = await uploadContent(config.ipfsPostURL, JSON.stringify(jsonData));

        const receipt = await sendTransactionWithGSN(
          config,
          ContractType.TreeFactory,
          web3,
          address,
          'plantAssignedTree',
          [Hex2Dec(journey.treeIdToPlant), metaDataUploadResult.Hash, jsonData.updates[0].created_at, 0],
          useGSN,
        );

        console.log(receipt.transactionHash, 'receipt.transactionHash');

        setOfflineLoadings(offlineLoadings.filter(id => id !== journey.offlineId));
        dispatchRemoveOfflineTree(journey.offlineId);
      } catch (error: any) {
        console.log(error, 'e inside handleSubmitOfflineAssignedTree');
        Alert.alert(
          t('transactionFailed.title'),
          error?.message || error?.error?.message || t('transactionFailed.tryAgain'),
        );
        setOfflineLoadings(offlineLoadings.filter(id => id !== journey.treeIdToPlant));
      }
      setOfflineLoadings(offlineLoadings.filter(id => id !== journey.treeIdToPlant));
    },
    [address, config, dispatchRemoveOfflineTree, isConnected, offlineLoadings, t, useGSN, web3],
  );

  const alertNoInternet = useCallback(() => {
    Alert.alert(t('noInternet'), t('submitWhenOnline'));
  }, [t]);

  const handleSubmitOfflineTree = useCallback(
    async (treeJourney: TreeJourney) => {
      // eslint-disable-next-line no-negated-condition
      if (!isConnected) {
        alertNoInternet();
      } else {
        if (!treeJourney.offlineId || !treeJourney.photo) {
          return;
        }

        setOfflineLoadings([...offlineLoadings, treeJourney.offlineId]);
        try {
          const photoUploadResult = await upload(config.ipfsPostURL, photoToUpload(treeJourney.photo));
          const jsonData = newTreeJSON(config.ipfsGetURL, {
            journey: treeJourney,
            photoUploadHash: photoUploadResult.Hash,
          });

          const metaDataUploadResult = await uploadContent(config.ipfsPostURL, JSON.stringify(jsonData));
          console.log(metaDataUploadResult.Hash, 'metaDataUploadResult.Hash');

          const receipt = await sendTransactionWithGSN(
            config,
            ContractType.TreeFactory,
            web3,
            address,
            'plantTree',
            [metaDataUploadResult.Hash, jsonData.updates[0].created_at, 0],
            useGSN,
          );

          console.log(receipt.transactionHash, 'receipt.transactionHash');

          setOfflineLoadings(offlineLoadings.filter(id => id !== treeJourney.offlineId));
          dispatchRemoveOfflineTree(treeJourney.offlineId);
        } catch (error: any) {
          Alert.alert(
            t('transactionFailed.title'),
            error?.message || error?.error?.message || t('transactionFailed.tryAgain'),
          );
          setOfflineLoadings(offlineLoadings.filter(id => id !== treeJourney.offlineId));
        }
        setOfflineLoadings(offlineLoadings.filter(id => id !== treeJourney.offlineId));
      }
    },
    [address, alertNoInternet, config, dispatchRemoveOfflineTree, isConnected, offlineLoadings, t, useGSN, web3],
  );

  const handleSendAllOffline = useCallback(
    async (trees: TreeJourney[] | Tree[], isPlanted: boolean) => {
      // eslint-disable-next-line no-negated-condition
      if (!isConnected) {
        alertNoInternet();
      } else {
        try {
          for (const tree of trees) {
            if (isPlanted) {
              if ((tree as TreeJourney).treeIdToPlant) {
                await handleSubmitOfflineAssignedTree(tree as TreeJourney);
              } else {
                await handleSubmitOfflineTree(tree as TreeJourney);
              }
            } else {
              await handleUpdateOfflineTree(tree as Tree & TreeJourney);
            }
          }
          Alert.alert(t('offlineTreesSubmitted'));
        } catch (error: any) {
          setLoadingMinimized(false);
          Alert.alert(t('error'), error?.message || t('tryAgain'));
        }
      }
    },
    [
      alertNoInternet,
      handleSubmitOfflineAssignedTree,
      handleSubmitOfflineTree,
      handleUpdateOfflineTree,
      isConnected,
      t,
    ],
  );

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
      offlineLoadings,
      setOfflineLoadings,
      offlineUpdateLoadings,
      setOfflineUpdateLoadings,
      handleSendAllOffline,
      handleSubmitOfflineTree,
      alertNoInternet,
      handleSubmitOfflineAssignedTree,
      handleUpdateOfflineTree,
      loadingMinimized,
      setLoadingMinimized,
    }),
    [
      state,
      dispatchAddOfflineTree,
      dispatchAddOfflineTrees,
      dispatchRemoveOfflineTree,
      dispatchAddOfflineUpdateTree,
      dispatchRemoveOfflineUpdateTree,
      dispatchResetOfflineTrees,
      offlineLoadings,
      offlineUpdateLoadings,
      handleSendAllOffline,
      handleSubmitOfflineTree,
      alertNoInternet,
      handleSubmitOfflineAssignedTree,
      handleUpdateOfflineTree,
      loadingMinimized,
      setLoadingMinimized,
    ],
  );

  return <OfflineTressContext.Provider value={value}>{children}</OfflineTressContext.Provider>;
}

export function useOfflineTrees() {
  return React.useContext(OfflineTressContext);
}
