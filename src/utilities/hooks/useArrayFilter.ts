import React, {useCallback, useEffect, useState} from 'react';

export type TUseArrayFilter<T, D = any> = {
  data: D[] | null;
  filters: T[];
  setFilters: React.Dispatch<React.SetStateAction<T[]>>;
  handleSetFilter: (filter: T) => void;
  handleFilterData: (array: D[], checkWhat: string) => D[];
};

export type TUseArrayFilterArgs<T, D = any> = {
  defaultFilters?: T[];
  defaultData?: D[];
  checkWhat?: string;
};

export function useArrayFilter<T, D = any>({
  defaultFilters,
  defaultData,
  checkWhat,
}: TUseArrayFilterArgs<T, D> = {}): TUseArrayFilter<T, D> {
  const [filters, setFilters] = useState<T[]>(defaultFilters || []);
  const [data, setData] = useState<D[] | null>(defaultData || null);

  useEffect(() => {
    if (defaultData) {
      setData(defaultData);
    }
  }, [defaultData]);

  const handleSetFilter = useCallback(
    (pressedFilter: T) => {
      if (filters?.some(filter => filter === pressedFilter)) {
        setFilters(filters.filter(filter => filter !== pressedFilter));
      } else {
        setFilters([...filters, pressedFilter]);
      }
    },
    [filters],
  );

  const handleFilterLocalData = useCallback(() => {
    if (data && defaultData && checkWhat) {
      setData(defaultData?.filter(item => (filters.length ? filters.includes(item[checkWhat]) : item)));
    }
  }, [filters, data, checkWhat]);

  useEffect(() => {
    if (data && defaultData) {
      handleFilterLocalData();
    }
  }, [filters]);

  const handleFilterData = useCallback(
    (data: D[], checkWhat: string) => {
      return data.filter(item => (filters.length ? filters.includes(item[checkWhat]) : item));
    },
    [filters],
  );

  return {
    data,
    filters,
    setFilters,
    handleSetFilter,
    handleFilterData,
  };
}
