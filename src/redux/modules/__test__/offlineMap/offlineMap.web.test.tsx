import assert from 'assert';
import {renderHook} from '@testing-library/react-hooks';

import {offlineMapSagas, useOfflineMap} from 'ranger-redux/modules/offlineMap/offlineMap.web';

describe('offlineMap.web hook', () => {
  const {result} = renderHook(() => useOfflineMap());
  it('should return state value', () => {
    expect(result.current.loading).toBe(false);
    expect(result.current.packs).toEqual(['']);
    expect(result.current.downloadingPack).toEqual(null);
  });
});

it('offlineMapSagas', () => {
  const dispatch = (fn: () => void) => {};
  const gen = offlineMapSagas({dispatch} as any);
  assert.deepEqual(gen.next().value, undefined);
});
