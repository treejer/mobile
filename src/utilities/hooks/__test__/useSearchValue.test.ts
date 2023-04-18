import {useSearchValue} from 'utilities/hooks/useSearchValue';
import {act, renderHook} from '@testing-library/react-hooks';

describe('useSearchValue hook', () => {
  it('useSearchValue hook should be defined', () => {
    expect(useSearchValue).toBeDefined();
    expect(typeof useSearchValue).toBe('function');
  });

  describe('useSearchValue', () => {
    it('default value should be empty string', () => {
      const {result} = renderHook(() => useSearchValue());
      expect(result.current.value).toBe('');
    });
    it('value should change to TEST', () => {
      const {result} = renderHook(() => useSearchValue());
      act(() => {
        result.current.handleChangeText('TEST');
      });
      expect(result.current.value).toBe('TEST');
    });
    it('value should change to TEST with native onChange', () => {
      const {result} = renderHook(() => useSearchValue());
      act(() => {
        result.current.handleChangeNative({text: 'TEST', eventCount: 4, target: 0});
      });
      expect(result.current.value).toBe('TEST');
    });
  });
});
