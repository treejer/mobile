import {useArrayFilter} from 'utilities/hooks/useArrayFilter';
import {act, renderHook} from '@testing-library/react-hooks';

describe('useArrayFilter hook', () => {
  it('useArrayFilter hook should be defined', () => {
    expect(useArrayFilter).toBeDefined();
    expect(typeof useArrayFilter).toBe('function');
  });

  const mockData = [
    {title: 'Title 1', status: 'status 1'},
    {title: 'Title 2', status: 'status 2'},
    {title: 'Title 3', status: 'status 3'},
  ];

  describe('useArrayFilter local data', () => {
    it('data should be mockData', () => {
      const {result} = renderHook(() =>
        useArrayFilter<string, {title: string; status: string}>({
          defaultData: mockData,
          checkWhat: 'status',
        }),
      );

      expect(result.current.data).toEqual(mockData);
    });

    it('update filters state => should return items with status: 2', () => {
      const {result} = renderHook(() =>
        useArrayFilter<string, {title: string; status: string}>({
          defaultData: mockData,
          checkWhat: 'status',
        }),
      );

      expect(result.current.data).toEqual(mockData);

      act(() => {
        result.current.handleSetFilter('status 2');
      });

      expect(result.current.data).toEqual(mockData.filter(item => result.current.filters.includes(item.status)));
      expect(result.current.filters).toEqual(['status 2']);
    });

    it('update filters state => should return items with status: 2 and status: 3', () => {
      const {result} = renderHook(() =>
        useArrayFilter<string, {title: string; status: string}>({
          defaultData: mockData,
          checkWhat: 'status',
        }),
      );

      expect(result.current.data).toEqual(mockData);

      act(() => {
        result.current.handleSetFilter('status 2');
      });
      expect(result.current.filters).toEqual(['status 2']);
      expect(result.current.data).toEqual(mockData.filter(item => result.current.filters.includes(item.status)));

      act(() => {
        result.current.handleSetFilter('status 3');
      });
      expect(result.current.filters).toEqual(['status 2', 'status 3']);
      expect(result.current.data).toEqual(mockData.filter(item => result.current.filters.includes(item.status)));
    });
    it('remove on of the selected filters', () => {
      const {result} = renderHook(() =>
        useArrayFilter<string, {title: string; status: string}>({
          defaultData: mockData,
          checkWhat: 'status',
        }),
      );

      expect(result.current.data).toEqual(mockData);

      act(() => {
        result.current.handleSetFilter('status 2');
      });
      expect(result.current.filters).toEqual(['status 2']);
      expect(result.current.data).toEqual(mockData.filter(item => result.current.filters.includes(item.status)));

      act(() => {
        result.current.handleSetFilter('status 2');
      });
      expect(result.current.filters).toEqual([]);
      expect(result.current.data).toEqual(mockData);
    });
    it('use setFilters', () => {
      const {result} = renderHook(() =>
        useArrayFilter<string, {title: string; status: string}>({
          defaultData: mockData,
          checkWhat: 'status',
        }),
      );

      expect(result.current.data).toEqual(mockData);

      act(() => {
        result.current.setFilters(['status 2']);
      });
      expect(result.current.filters).toEqual(['status 2']);
      expect(result.current.data).toEqual(mockData.filter(item => item.status === 'status 2'));

      act(() => {
        result.current.setFilters(['status 2', 'status 3']);
      });
      expect(result.current.filters).toEqual(['status 2', 'status 3']);
      expect(result.current.data).toEqual(mockData.filter(item => ['status 2', 'status 3'].includes(item.status)));
    });
  });
  describe('useArrayFilter pass data and filter that data', () => {
    it('pass initial filters', () => {
      const {result} = renderHook(() =>
        useArrayFilter<string, {title: string; status: string}>({
          defaultFilters: ['status 1'],
        }),
      );

      expect(result.current.filters).toEqual(['status 1']);
      expect(result.current.data).toEqual(null);
    });
    it('pass data and filter that data', () => {
      const {result} = renderHook(() =>
        useArrayFilter<string, {title: string; status: string}>({
          defaultFilters: ['status 1'],
        }),
      );
      expect(result.current.data).toBe(null);

      let data;
      act(() => {
        data = result.current.handleFilterData(mockData, 'status');
      });
      expect(data).toEqual(mockData.filter(item => result.current.filters.includes(item.status)));
      expect(result.current.data).toBe(null);

      act(() => {
        result.current.handleSetFilter('status 2');
      });

      expect(result.current.filters).toEqual(['status 1', 'status 2']);
      expect(result.current.data).toBe(null);

      act(() => {
        data = result.current.handleFilterData(mockData, 'status');
      });
      expect(data).toEqual(mockData.filter(item => result.current.filters.includes(item.status)));
      expect(result.current.data).toBe(null);

      act(() => {
        result.current.handleSetFilter('status 1');
      });

      expect(result.current.filters).toEqual(['status 2']);
      expect(result.current.data).toBe(null);

      act(() => {
        data = result.current.handleFilterData(mockData, 'status');
      });
      expect(data).toEqual(mockData.filter(item => result.current.filters.includes(item.status)));
      expect(result.current.data).toBe(null);
    });
  });
  describe('useArrayFilter custom filter handler', () => {
    it('pass initial filters and canSelectMultiple = false', () => {
      const {result} = renderHook(() =>
        useArrayFilter<string, {title: string; status: string}>({
          defaultFilters: ['status 1'],
          canSelectMultiple: false,
        }),
      );

      expect(result.current.filters).toEqual(['status 1']);
      expect(result.current.data).toEqual(null);

      act(() => {
        result.current.handleSetFilter('status 2');
      });
      expect(result.current.filters).toEqual(['status 2']);
      act(() => {
        result.current.handleSetFilter('status 2');
      });
      expect(result.current.filters).toEqual([]);
    });

    it('use custom filter handler filter if even filters is empty', () => {
      const mockData = ['one', 'two', 'three'];
      const {result} = renderHook(() =>
        useArrayFilter<string, string>({
          defaultData: mockData,
          canSelectMultiple: false,
          customFilterHandler: (data, filters) => {
            return data.filter(item => filters.includes(item));
          },
        }),
      );

      expect(result.current.filters).toEqual([]);
      expect(result.current.data).toEqual([]);
    });
    it('use custom filter handler', () => {
      const mockData = ['one', 'two', 'three'];
      const {result} = renderHook(() =>
        useArrayFilter<string, string>({
          defaultData: mockData,
          canSelectMultiple: false,
          customFilterHandler: (data, filters) => {
            return data.filter(item => (filters.length ? filters.includes(item) : item));
          },
        }),
      );

      expect(result.current.filters).toEqual([]);
      expect(result.current.data).toEqual(mockData);

      act(() => {
        result.current.handleSetFilter('two');
      });
      expect(result.current.filters).toEqual(['two']);
      expect(result.current.data).toEqual(['two']);
      act(() => {
        result.current.handleSetFilter('one');
      });
      expect(result.current.data).toEqual(['one']);
      let data;

      act(() => {
        result.current.handleSetFilter('1');
      });
      act(() => {
        data = result.current.handleFilterData(['1', '2', '3']);
      });

      expect(data).toEqual(['1']);
    });
    it('can deselect last filter', () => {
      const mockData = ['one', 'two', 'three'];

      const {result} = renderHook(() =>
        useArrayFilter<string, string>({
          defaultData: mockData,
          defaultFilters: ['one'],
          canSelectMultiple: false,
          canDeSelectLastItem: false,
        }),
      );

      act(() => {
        result.current.handleSetFilter('one');
      });

      expect(result.current.filters).toEqual(['one']);
    });
  });
});
