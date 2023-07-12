import assert from 'assert';
import {put, select, takeEvery} from 'redux-saga/effects';
import {renderHook} from '@testing-library/react-hooks';
import {AllTheProviders} from 'ranger-testUtils/testingLibrary';
import MapboxGL from '@rnmapbox/maps';

import {getAreaName} from 'utilities/helpers/maps';
import {mapboxPrivateToken} from 'services/config';
import {getNetInfo} from 'ranger-redux/modules/netInfo/netInfo';
import * as offlineMap from 'ranger-redux/modules/offlineMap/offlineMap';

describe('offlineMap actions', () => {
  it('create offline map pack', () => {
    const downloadingMapPack: offlineMap.TDownloadingMapPack = {
      areaName: 'areaName',
      bounds: [
        [2, 2],
        [2, 2],
      ],
      coords: [2, 2],
      name: 'name',
    };
    const expectedAction = {
      type: offlineMap.CREATE_OFFLINE_MAP_PACK,
      downloadingMapPack,
      silent: true,
    };
    expect(offlineMap.createOfflineMapPack(downloadingMapPack, true)).toEqual(expectedAction);
  });
  it('update downloading area name', () => {
    const expectedAction = {
      type: offlineMap.UPDATE_DOWNLOADING_AREA_NAME,
      updatingAreaName: 'updatingAreaName',
    };
    expect(offlineMap.updateAreaName('updatingAreaName')).toEqual(expectedAction);
  });
  it('create offline map pack success', () => {
    const pack: offlineMap.TOfflineMapPack = {
      name: 'name',
      areaName: 'areaName',
      bounds: [
        [2, 2],
        [2, 2],
      ],
      coords: [2, 2],
      metadata: '',
      size: 2,
    };
    const expectedAction = {
      type: offlineMap.CREATE_OFFLINE_MAP_PACK_SUCCESS,
      pack,
    };
    expect(offlineMap.createOfflineMapPackSuccess(pack)).toEqual(expectedAction);
  });
  it('create offline map pack failure', () => {
    const expectedAction = {
      type: offlineMap.CREATE_OFFLINE_MAP_PACK_FAILURE,
    };
    expect(offlineMap.createOfflineMapPackFailure()).toEqual(expectedAction);
  });
  it('delete offline map pack', () => {
    const expectedAction = {
      type: offlineMap.DELETE_OFFLINE_MAP_PACK,
      name: 'name',
    };
    expect(offlineMap.deleteOfflineMapPack('name')).toEqual(expectedAction);
  });
});

describe('offlineMap reducer', () => {
  const initialState = {
    packs: [],
    loading: false,
    downloadingPack: null,
  };
  const downloadingMapPack: offlineMap.TDownloadingMapPack = {
    areaName: 'areaName',
    bounds: [
      [2, 2],
      [2, 2],
    ],
    coords: [2, 2],
    name: 'name',
  };
  it('should return initial state', () => {
    expect(offlineMap.offlineMapReducer(initialState, {type: ''} as any)).toEqual(initialState);
  });
  it('should handle CREATE_OFFLINE_MAP_PACK', () => {
    const expectedState = {
      ...initialState,
      loading: true,
      downloadingPack: downloadingMapPack,
    };
    expect(
      offlineMap.offlineMapReducer(initialState, {
        type: offlineMap.CREATE_OFFLINE_MAP_PACK,
        downloadingMapPack: downloadingMapPack,
        silent: true,
      } as any),
    ).toEqual(expectedState);
  });
  it('should handle UPDATE_DOWNLOADING_AREA_NAME', () => {
    const initialState = {
      packs: [],
      loading: true,
      downloadingPack: downloadingMapPack,
    };
    const expectedState = {
      ...initialState,
      downloadingPack: {...downloadingMapPack, areaName: 'newAreaName'},
    };
    expect(
      offlineMap.offlineMapReducer(initialState, {
        type: offlineMap.UPDATE_DOWNLOADING_AREA_NAME,
        updatingAreaName: 'newAreaName',
      } as any),
    ).toEqual(expectedState);
  });
  it('should handle UPDATE_DOWNLOADING_AREA_NAME, empty downloadingPack', () => {
    const initialState = {
      packs: [],
      loading: true,
      downloadingPack: null,
    };
    const expectedState = {
      ...initialState,
      downloadingPack: null,
    };
    expect(
      offlineMap.offlineMapReducer(initialState, {
        type: offlineMap.UPDATE_DOWNLOADING_AREA_NAME,
        updatingAreaName: 'newAreaName',
      } as any),
    ).toEqual(expectedState);
  });
  it('should handle UPDATE_DOWNLOADING_AREA_NAME', () => {
    const initialState = {
      packs: [],
      loading: true,
      downloadingPack: downloadingMapPack,
    };
    const expectedState = {
      ...initialState,
      downloadingPack: {...downloadingMapPack, areaName: 'newAreaName'},
    };
    expect(
      offlineMap.offlineMapReducer(initialState, {
        type: offlineMap.UPDATE_DOWNLOADING_AREA_NAME,
        updatingAreaName: 'newAreaName',
      } as any),
    ).toEqual(expectedState);
  });
  it('should handle CREATE_OFFLINE_MAP_PACK_SUCCESS', () => {
    const initialState = {
      packs: [],
      loading: true,
      downloadingPack: downloadingMapPack,
    };
    const pack: offlineMap.TOfflineMapPack = {
      name: 'name',
      areaName: 'areaName',
      bounds: [
        [2, 2],
        [2, 2],
      ],
      coords: [2, 2],
      metadata: '',
      size: 2,
    };
    const expectedState = {
      packs: [pack],
      loading: false,
      downloadingPack: null,
    };
    expect(
      offlineMap.offlineMapReducer(initialState, {type: offlineMap.CREATE_OFFLINE_MAP_PACK_SUCCESS, pack} as any),
    ).toEqual(expectedState);
  });
  it('should handle CREATE_OFFLINE_MAP_PACK_FAILURE', () => {
    const pack: offlineMap.TOfflineMapPack = {
      name: 'name',
      areaName: 'areaName',
      bounds: [
        [2, 2],
        [2, 2],
      ],
      coords: [2, 2],
      metadata: '',
      size: 2,
    };
    const initialState = {
      packs: [pack],
      loading: true,
      downloadingPack: downloadingMapPack,
    };
    const expectedState = {
      ...initialState,
      loading: false,
      downloadingPack: null,
    };
    expect(
      offlineMap.offlineMapReducer(initialState, {type: offlineMap.CREATE_OFFLINE_MAP_PACK_FAILURE} as any),
    ).toEqual(expectedState);
  });
  it('should handle DELETE_OFFLINE_MAP_PACK', () => {
    const packOne: offlineMap.TOfflineMapPack = {
      name: 'name',
      areaName: 'areaName',
      bounds: [
        [2, 2],
        [2, 2],
      ],
      coords: [2, 2],
      metadata: '',
      size: 2,
    };
    const packTwo: offlineMap.TOfflineMapPack = {
      name: 'nameTwo',
      areaName: 'areaName',
      bounds: [
        [2, 2],
        [2, 2],
      ],
      coords: [2, 2],
      metadata: '',
      size: 2,
    };
    const initialState = {
      loading: false,
      downloadingPack: null,
      packs: [packOne, packTwo],
    };
    const expectedState = {
      ...initialState,
      packs: [packTwo],
    };
    expect(
      offlineMap.offlineMapReducer(initialState, {type: offlineMap.DELETE_OFFLINE_MAP_PACK, name: 'name'} as any),
    ).toEqual(expectedState);
  });
});

describe('offlineMap saga functions', () => {
  describe('offlineMap sagas', () => {
    it('offlineMap sagas should be defined', () => {
      expect(offlineMap.offlineMapSagas).toBeDefined();
    });
    it('offlineMap sagas should yield createOfflineMapPack', () => {
      const dispatch = (fn: () => {}) => {};
      const gen = offlineMap.offlineMapSagas({dispatch} as any);
      assert.deepEqual(
        gen.next().value,
        takeEvery(offlineMap.CREATE_OFFLINE_MAP_PACK, offlineMap.watchCreateOfflineMapPack, {dispatch} as any),
      );
    });
  });
  describe('watchCreateOfflineMapPack', () => {
    it('watchCreateOfflineMapPack should be defined', () => {
      expect(offlineMap.watchCreateOfflineMapPack).toBeDefined();
    });
    it('watchCreateOfflineMapPack disconnected network', () => {
      const dispatch = (fn: () => {}) => {};
      const downloadingMapPack: offlineMap.TDownloadingMapPack = {
        areaName: 'areaName',
        bounds: [
          [2, 2],
          [2, 2],
        ],
        coords: [2, 2],
        name: 'name',
      };

      const gen = offlineMap.watchCreateOfflineMapPack(
        {dispatch} as any,
        {
          type: offlineMap.CREATE_OFFLINE_MAP_PACK,
          downloadingMapPack,
          silent: true,
        } as any,
      );
      assert.deepEqual(gen.next().value, select(getNetInfo));
      assert.deepEqual(gen.next(false).value, put(offlineMap.createOfflineMapPackFailure()));
      assert.deepEqual(gen.next().value, undefined);
    });
    it('watchCreateOfflineMapPack failure silent has area', () => {
      const dispatch = (fn: () => {}) => {};
      const downloadingMapPack: offlineMap.TDownloadingMapPack = {
        areaName: 'areaName',
        bounds: [
          [2, 2],
          [2, 2],
        ],
        coords: [2, 2],
        name: 'name',
      };

      const gen = offlineMap.watchCreateOfflineMapPack(
        {dispatch} as any,
        {
          type: offlineMap.CREATE_OFFLINE_MAP_PACK,
          downloadingMapPack,
          silent: true,
        } as any,
      );
      const packOne: offlineMap.TOfflineMapPack = {
        name: 'name',
        areaName: 'areaName',
        bounds: [
          [2, 2],
          [2, 2],
        ],
        coords: [2, 2],
        metadata: '',
        size: 2,
      };
      const packTwo: offlineMap.TOfflineMapPack = {
        name: 'nameTwo',
        areaName: 'areaNameTwo',
        bounds: [
          [2, 2],
          [2, 2],
        ],
        coords: [2, 2],
        metadata: '',
        size: 2,
      };
      const mockPacks = [packOne, packTwo];
      assert.deepEqual(gen.next().value, select(getNetInfo));
      assert.deepEqual(gen.next(true).value, select(offlineMap.getOfflineMapPacks));
      // @ts-ignore
      assert.deepEqual(gen.next(mockPacks).value, getAreaName(packOne.coords, mapboxPrivateToken));
      // @ts-ignore
      assert.deepEqual(gen.next('areaName').value, put(offlineMap.createOfflineMapPackFailure()));
    });
    it('watchCreateOfflineMapPack failure has area', () => {
      const dispatch = (fn: () => {}) => {};
      const downloadingMapPack: offlineMap.TDownloadingMapPack = {
        areaName: 'areaName',
        bounds: [
          [2, 2],
          [2, 2],
        ],
        coords: [2, 2],
        name: 'name',
      };

      const gen = offlineMap.watchCreateOfflineMapPack(
        {dispatch} as any,
        {
          type: offlineMap.CREATE_OFFLINE_MAP_PACK,
          downloadingMapPack,
          silent: false,
        } as any,
      );
      const packOne: offlineMap.TOfflineMapPack = {
        name: 'name',
        areaName: 'areaName',
        bounds: [
          [2, 2],
          [2, 2],
        ],
        coords: [2, 2],
        metadata: '',
        size: 2,
      };
      const packTwo: offlineMap.TOfflineMapPack = {
        name: 'nameTwo',
        areaName: 'areaNameTwo',
        bounds: [
          [2, 2],
          [2, 2],
        ],
        coords: [2, 2],
        metadata: '',
        size: 2,
      };
      const mockPacks = [packOne, packTwo];
      assert.deepEqual(gen.next().value, select(getNetInfo));
      assert.deepEqual(gen.next(true).value, select(offlineMap.getOfflineMapPacks));
      // @ts-ignore
      assert.deepEqual(gen.next(mockPacks).value, getAreaName(packOne.coords, mapboxPrivateToken));
      // @ts-ignore
      assert.deepEqual(gen.next('areaName').value, put(offlineMap.createOfflineMapPackFailure()));
      gen.next();
      expect(global.toast.show).toHaveBeenCalled();
      assert.deepEqual(gen.next().value, undefined);
    });
    it('watchCreateOfflineMapPack success has not areaName', () => {
      const dispatch = (fn: () => {}) => {};
      const downloadingMapPack: offlineMap.TDownloadingMapPack = {
        areaName: 'areaNameD',
        bounds: [
          [2, 2],
          [2, 2],
        ],
        coords: [2, 2],
        name: 'name',
      };
      const gen = offlineMap.watchCreateOfflineMapPack(
        {dispatch} as any,
        {
          type: offlineMap.CREATE_OFFLINE_MAP_PACK,
          downloadingMapPack,
          silent: false,
        } as any,
      );
      const packOne: offlineMap.TOfflineMapPack = {
        name: 'name',
        areaName: 'areaName',
        bounds: [
          [2, 2],
          [2, 2],
        ],
        coords: [2, 2],
        metadata: '',
        size: 2,
      };
      const packTwo: offlineMap.TOfflineMapPack = {
        name: 'nameTwo',
        areaName: 'areaNameTwo',
        bounds: [
          [2, 2],
          [2, 2],
        ],
        coords: [2, 2],
        metadata: '',
        size: 2,
      };
      const mockPacks = [packOne, packTwo];
      assert.deepEqual(gen.next().value, select(getNetInfo));
      assert.deepEqual(gen.next(true).value, select(getOfflineMapPacks));
      // @ts-ignore
      assert.deepEqual(gen.next(mockPacks).value, getAreaName(packOne.coords, mapboxPrivateToken));
      // @ts-ignore
      assert.deepEqual(gen.next('areaNameD').value, put(offlineMap.updateAreaName('areaNameD')));
      assert.deepEqual(
        gen.next().value,
        MapboxGL.offlineManager.createPack(
          {
            name: downloadingMapPack.name,
            styleURL: 'mapbox://styles/sagararl/ckdfyrsw80y3a1il9eqpecoc7',
            minZoom: 14,
            maxZoom: 20,
            bounds: [downloadingMapPack.bounds[0], downloadingMapPack.bounds[1]],
          },
          () => {},
          () => {},
        ),
      );
    });
    it('watchCreateOfflineMapPack failure isSilent', () => {
      const dispatch = (fn: () => {}) => {};
      const gen = offlineMap.watchCreateOfflineMapPack({dispatch} as any, {silent: true} as any);
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(gen.throw(error).value, put(offlineMap.createOfflineMapPackFailure()));
    });
    it('watchCreateOfflineMapPack failure', () => {
      const dispatch = (fn: () => {}) => {};
      const gen = offlineMap.watchCreateOfflineMapPack({dispatch} as any, {silent: false} as any);
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(gen.throw(error).value, put(offlineMap.createOfflineMapPackFailure()));
      gen.next();
      expect(global.toast.show).toHaveBeenCalled();
    });
  });
});

describe('offlineMap hook', () => {
  const {result} = renderHook(() => offlineMap.useOfflineMap(), {
    wrapper: props => (
      <AllTheProviders
        {...(props as any)}
        initialState={{offlineMap: {loading: false, packs: [], downloadingPack: null}}}
      />
    ),
  });
  it('should return state value', () => {
    expect(result.current.loading).toBe(false);
    expect(result.current.packs).toEqual([]);
    expect(result.current.downloadingPack).toEqual(null);
  });
});
