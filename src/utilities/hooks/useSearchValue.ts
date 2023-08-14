import React, {useState, useCallback} from 'react';
import {TextInputChangeEventData} from 'react-native';

import {useDebounce} from 'utilities/hooks/useDebounce';

export type TUserSearchValue = {
  value: string;
  debouncedValue: string;
  handleChangeText: React.Dispatch<React.SetStateAction<string>>;
  handleChangeNative: (nativeEvent: TextInputChangeEventData) => void;
};

export function useSearchValue(defaultValue: string = ''): TUserSearchValue {
  const [value, setValue] = useState<string>(defaultValue);
  const debouncedValue = useDebounce(value);

  const handleChangeNative = useCallback(({text}: TextInputChangeEventData) => {
    setValue(text);
  }, []);

  return {
    value,
    debouncedValue,
    handleChangeText: setValue,
    handleChangeNative,
  };
}
