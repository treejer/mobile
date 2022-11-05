import {TStoreRedux} from 'ranger-redux/store';

export function useOfflineMap() {
  return {
    packs: [''],
    loading: false,
    downloadingPack: null,
  };
}

export function* offlineMapSagas(store: TStoreRedux) {}
