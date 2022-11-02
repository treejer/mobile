import {put, select, takeEvery} from 'redux-saga/effects';
import MapboxGL from '@rnmapbox/maps';
import {AlertMode} from 'utilities/helpers/alert';
import {TReduxState, TStoreRedux} from 'ranger-redux/store';
import {getAreaName} from 'utilities/helpers/maps';
import {mapboxPrivateToken, offlineSubmittingMapName} from 'services/config';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {useCallback} from 'react';
import {selectNetInfo} from 'ranger-redux/modules/netInfo/netInfo';

export type Position = number[];

export type TOfflineMapPack = {
  areaName: string;
  size: number;
  name: string;
  bounds: Position[];
  // 0: longitude 1: latitude
  coords: Position;
  metadata: any;
};

export type TDownloadingMapPack = Pick<TOfflineMapPack, 'bounds' | 'name' | 'coords'> & {
  areaName?: string;
};

export type TOfflineMapAction = {
  type: string;
  downloadingMapPack: TDownloadingMapPack;
  name: string;
  pack: TOfflineMapPack;
  updatingAreaName: string;
  silent: boolean;
};

export type TOfflineMapState = {
  packs: TOfflineMapPack[];
  loading: boolean;
  downloadingPack: TDownloadingMapPack | null;
};

export const offlineMapInitialState: TOfflineMapState = {
  packs: [],
  loading: false,
  downloadingPack: null,
};

export const CREATE_OFFLINE_MAP_PACK = 'CREATE_OFFLINE_MAP_PACK';
export const createOfflineMapPack = (downloadingMapPack: TDownloadingMapPack, silent: boolean) => ({
  type: CREATE_OFFLINE_MAP_PACK,
  downloadingMapPack,
  silent,
});

export const UPDATE_DOWNLOADING_AREA_NAME = 'UPDATE_DOWNLOADING_AREA_NAME';
export const updateAreaName = (updatingAreaName: string) => ({
  type: UPDATE_DOWNLOADING_AREA_NAME,
  updatingAreaName,
});

export const CREATE_OFFLINE_MAP_PACK_SUCCESS = 'CREATE_OFFLINE_MAP_PACK_SUCCESS';
export const createOfflineMapPackSuccess = (pack: TOfflineMapPack) => ({
  type: CREATE_OFFLINE_MAP_PACK_SUCCESS,
  pack,
});

export const CREATE_OFFLINE_MAP_PACK_FAILURE = 'CREATE_OFFLINE_MAP_PACK_FAILURE';
export const createOfflineMapPackFailure = () => ({
  type: CREATE_OFFLINE_MAP_PACK_FAILURE,
});

export const DELETE_OFFLINE_MAP_PACK = 'DELETE_OFFLINE_MAP_PACK';
export const deleteOfflineMapPack = (name: string) => ({
  type: DELETE_OFFLINE_MAP_PACK,
  name,
});

export function offlineMap(
  state: TOfflineMapState = offlineMapInitialState,
  action: TOfflineMapAction,
): TOfflineMapState {
  switch (action.type) {
    case CREATE_OFFLINE_MAP_PACK:
      return {
        ...state,
        loading: true,
        downloadingPack: action.downloadingMapPack,
      };
    case UPDATE_DOWNLOADING_AREA_NAME:
      return {
        ...state,
        downloadingPack: state.downloadingPack
          ? {
              ...state.downloadingPack,
              areaName: action.updatingAreaName,
            }
          : state.downloadingPack,
      };
    case CREATE_OFFLINE_MAP_PACK_SUCCESS:
      return {
        ...state,
        loading: false,
        downloadingPack: null,
        packs: [...(state.packs || []), action.pack],
      };
    case CREATE_OFFLINE_MAP_PACK_FAILURE:
      return {
        ...state,
        loading: false,
        downloadingPack: null,
      };
    case DELETE_OFFLINE_MAP_PACK:
      return {
        ...state,
        packs: state.packs?.length ? state.packs.filter(item => item.name !== action.name) : state.packs,
      };
    default:
      return state;
  }
}

export function* watchCreateOfflineMapPack(store: TStoreRedux, {downloadingMapPack, silent}: TOfflineMapAction) {
  try {
    const isConnected: boolean = yield selectNetInfo();
    if (isConnected) {
      const {bounds, name, coords} = downloadingMapPack || {};

      const packs = yield select((state: TReduxState) => state.offlineMap.packs);
      const areaName = yield getAreaName(coords, mapboxPrivateToken);
      const hasArea = packs.find(item => item.areaName === areaName);
      if (hasArea) {
        yield put(createOfflineMapPackFailure());
        if (!silent) {
          toast?.show('offlineMap.isDownloaded', {type: AlertMode.Info, translate: true});
        }
      } else {
        yield put(updateAreaName(areaName));

        const progressListener = (offlineRegion: MapboxGL.OfflinePack, status: MapboxGL.OfflineProgressStatus) => {
          // console.log(JSON.stringify(offlineRegion), status, 'progressListener');
          if (status.percentage === 100) {
            store.dispatch(
              createOfflineMapPackSuccess({
                coords,
                areaName,
                name,
                bounds,
                size: status.completedResourceSize,
                metadata: offlineRegion.metadata,
              }),
            );
            if (!silent) {
              toast?.show('offlineMap.downloaded', {type: AlertMode.Success, translate: true});
            }
          }
        };
        const errorListener = (offlineRegion: MapboxGL.OfflinePack, err: MapboxGL.OfflineProgressError) => {
          store.dispatch(createOfflineMapPackFailure());
          if (!silent) {
            toast?.show(err.message, {type: AlertMode.Error});
          }
        };

        yield MapboxGL.offlineManager.createPack(
          {
            name,
            styleURL: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
            minZoom: 14,
            maxZoom: 20,
            bounds: bounds ? [bounds[0], bounds[1]] : undefined,
          },
          progressListener,
          errorListener,
        );
      }
    } else {
      yield put(createOfflineMapPackFailure());
      if (!silent) {
        toast?.show('checkNetwork', {translate: true, type: AlertMode.Error});
      }
    }
  } catch (e: any) {
    yield put(createOfflineMapPackFailure());
    if (e.message && !silent) {
      toast?.show(e.message, {type: AlertMode.Error});
    }
  }
}

export function* offlineMapSagas(store: TStoreRedux) {
  yield takeEvery(CREATE_OFFLINE_MAP_PACK, watchCreateOfflineMapPack, store);
}

export function useOfflineMap() {
  const state = useAppSelector(state => state.offlineMap);
  const dispatch = useAppDispatch();

  const dispatchCreateOfflineMap = useCallback(
    (downloadingPack: TDownloadingMapPack, silent = false) => {
      dispatch(createOfflineMapPack(downloadingPack, silent));
    },
    [dispatch],
  );

  const dispatchCreateSubmittingOfflineMap = useCallback(
    (downloadingPack: TDownloadingMapPack) => {
      const submittingPacks = state.packs.filter(item => item.name.includes(offlineSubmittingMapName().split('-')[0]));
      if (submittingPacks && submittingPacks.length < 3) {
        dispatch(createOfflineMapPack(downloadingPack, true));
      }
    },
    [dispatch, state.packs],
  );

  const dispatchDeleteOfflineMap = useCallback(
    (name: string) => {
      dispatch(deleteOfflineMapPack(name));
    },
    [dispatch],
  );

  return {
    ...state,
    dispatchCreateOfflineMap,
    dispatchDeleteOfflineMap,
    dispatchCreateSubmittingOfflineMap,
  };
}
