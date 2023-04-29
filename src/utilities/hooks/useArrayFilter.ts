import React, {useCallback, useEffect, useState} from 'react';

export type TUseArrayFilter<T, D = any> = {
  data: D[] | null;
  filters: T[];
  setFilters: React.Dispatch<React.SetStateAction<T[]>>;
  handleSetFilter: (filter: T) => void;
  handleFilterData: (array: D[], checkWhat?: string) => D[];
};

export type TUseArrayFilterArgs<T, D = any> = {
  defaultFilters?: T[];
  defaultData?: D[] | null;
  checkWhat?: string;
  canSelectMultiple?: boolean;
  customFilterHandler?: (array: D[], filters: T[]) => D[];
};

export function useArrayFilter<T, D = any>({
  defaultFilters,
  defaultData,
  checkWhat,
  customFilterHandler,
  canSelectMultiple = true,
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
        setFilters([...(canSelectMultiple ? filters : []), pressedFilter]);
      }
    },
    [filters, canSelectMultiple],
  );

  const handleFilterLocalData = useCallback(() => {
    if (data && defaultData && (customFilterHandler || checkWhat)) {
      setData(
        customFilterHandler
          ? customFilterHandler(defaultData, filters)
          : defaultData?.filter(item => (filters.length && !!checkWhat ? filters.includes(item[checkWhat]) : item)),
      );
    }
  }, [filters, data, defaultData, checkWhat, customFilterHandler]);

  useEffect(() => {
    if (data && defaultData) {
      handleFilterLocalData();
    }
  }, [filters]);

  const handleFilterData = useCallback(
    (data: D[], checkWhat?: string) => {
      return customFilterHandler
        ? customFilterHandler(data, filters)
        : data.filter(item => (filters.length && !!checkWhat ? filters.includes(item[checkWhat]) : item));
    },
    [filters, customFilterHandler],
  );

  return {
    data,
    filters,
    setFilters,
    handleSetFilter,
    handleFilterData,
  };
}
