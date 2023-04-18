import {render, fireEvent} from '@testing-library/react-native';
import {renderHook, act} from '@testing-library/react-hooks';

import {SearchInInventory} from 'screens/GreenBlock/components/SearchInInventory/SearchInInventory';
import {useSearchValue} from 'utilities/hooks/useSearchValue';
import {colors} from 'constants/values';

describe('SearchInInventory component', () => {
  it('SearchInInventory component should be defined', () => {
    expect(SearchInInventory).toBeDefined();
    expect(typeof SearchInInventory).toBe('function');
  });

  describe('SearchInInventory', () => {
    it('components/elements should be defined', () => {
      const {result} = renderHook(() => useSearchValue());
      const {getByTestId: getElementByTestId} = render(
        <SearchInInventory
          onClose={() => {}}
          value={result.current.value}
          debouncedValue={result.current.debouncedValue}
          handleChangeText={result.current.handleChangeText}
          handleChangeNative={result.current.handleChangeNative}
        />,
      );

      const searchIcon = getElementByTestId('search-icon');
      const searchInput = getElementByTestId('search-input');
      const closeBtn = getElementByTestId('close-button');
      const closeBtnIcon = getElementByTestId('close-button-icon');

      expect(searchIcon).toBeTruthy();
      expect(searchIcon.props.name).toBe('search');
      expect(searchIcon.props.color).toBe(colors.green);
      expect(searchInput).toBeTruthy();
      expect(searchInput.props.value).toBe('');
      expect(closeBtn).toBeTruthy();
      expect(closeBtnIcon).toBeTruthy();
      expect(closeBtnIcon.props.name).toBe('close');
      expect(closeBtnIcon.props.color).toBe(colors.green);
    });
    it('input value should change', () => {
      const {result} = renderHook(() => useSearchValue());
      const {getByTestId: getElementByTestId} = render(
        <SearchInInventory
          onClose={() => {}}
          value={result.current.value}
          debouncedValue={result.current.debouncedValue}
          handleChangeText={result.current.handleChangeText}
          handleChangeNative={result.current.handleChangeNative}
        />,
      );

      const searchInput = getElementByTestId('search-input');

      act(() => {
        fireEvent.changeText(searchInput, 'INPUT');
      });

      expect(result.current.value).toBe('INPUT');
    });
  });
});
