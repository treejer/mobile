import {render} from '@testing-library/react-native';

import {EmptyList} from 'components/Common/EmptyList';

describe('EmptyList component', () => {
  it('EmptyList component should be defined', () => {
    expect(EmptyList).toBeDefined();
    expect(typeof EmptyList).toBe('function');
  });

  describe('EmptyList', () => {
    let getElementByTestId;

    beforeEach(() => {
      const element = render(<EmptyList testID="empty-list-cpt" />);
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const container = getElementByTestId('empty-list-cpt');
      const emptyText = getElementByTestId('empty-text');
      const smileIcon = getElementByTestId('smile-icon');

      expect(container).toBeTruthy();
      expect(emptyText).toBeTruthy();
      expect(emptyText.props.children).toBe('empty');
      expect(smileIcon).toBeTruthy();
      expect(smileIcon.props.name).toBe('smileo');
    });
  });
});
