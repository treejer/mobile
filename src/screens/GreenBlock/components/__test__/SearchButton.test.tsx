import {render} from '@testing-library/react-native';

import {SearchButton} from 'screens/GreenBlock/components/SearchButton/SearchButton';

describe('SearchButton component', () => {
  it('SearchButton component should be defined', () => {
    expect(SearchButton).toBeDefined();
    expect(typeof SearchButton).toBe('function');
  });

  describe('SearchButton default icon', () => {
    describe('custom icon', () => {
      let getElementByTestId;
      const iconName = 'search';
      beforeEach(() => {
        const element = render(<SearchButton testID="search-button-cpt" onPress={() => {}} icon={iconName} />);
        getElementByTestId = element.getByTestId;
      });

      it('components/elements should be defined', () => {
        const button = getElementByTestId('search-button-cpt');
        const icon = getElementByTestId('icon');

        expect(button).toBeTruthy();
        expect(icon).toBeTruthy();
        expect(icon.props.name).toBe(iconName);
      });
    });
    describe('default icon', () => {
      let getElementByTestId;
      beforeEach(() => {
        const element = render(<SearchButton testID="search-button-cpt" onPress={() => {}} />);
        getElementByTestId = element.getByTestId;
      });

      it('components/elements should be defined', () => {
        const button = getElementByTestId('search-button-cpt');
        const icon = getElementByTestId('icon');

        expect(button).toBeTruthy();
        expect(icon).toBeTruthy();
        expect(icon.props.name).toBe('search');
      });
    });
  });
});
