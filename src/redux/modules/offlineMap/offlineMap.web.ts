import {TStoreRedux} from 'ranger-redux/store';

export function offlineMap() {
  return {
    packs: null,
    loading: false,
    downloadingPack: null,
  };
}

export function* offlineMapSagas(store: TStoreRedux) {}

export function useOfflineMap() {}
