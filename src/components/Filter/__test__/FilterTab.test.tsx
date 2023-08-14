import {render} from '@testing-library/react-native';

import {FilterTab} from 'components/Filter/FilterTab';
import {stylesToOneObject} from 'utilities/helpers/stylesToOneObject';
import {colors} from 'constants/values';

describe('FilterTab component', () => {
  it('FilterTab should be defined', () => {
    expect(FilterTab).toBeDefined();
    expect(typeof FilterTab).toBe('function');
  });

  describe('FilterTab inactive', () => {
    const title = 'title';
    const icon = 'search';

    let getElementByTestId;
    beforeEach(() => {
      const element = render(<FilterTab testID="tab" tab={{title, icon}} onPress={() => {}} isActive={false} />);
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const tab = getElementByTestId('tab');
      const tabButton = getElementByTestId(`tab-button-${title}`);
      const tabButtonText = getElementByTestId('tab-button-text');
      const tabButtonIcon = getElementByTestId('tab-button-icon');

      expect(tab).toBeTruthy();
      expect(tabButton).toBeTruthy();
      expect(tabButtonText).toBeTruthy();
      expect(tabButtonIcon).toBeTruthy();
      expect(tabButtonIcon.props.name).toBe(icon);
      expect(tabButtonIcon.props.color).toBe(colors.grayMidLight);
      expect(tabButtonText.props.children).toBe(title);
      expect(stylesToOneObject(tabButtonText.props.style).color).toBe(colors.grayMidLight);
    });
  });

  describe('FilterTab active', () => {
    const title = 'title';

    let getElementByTestId, queryElementByTestId;
    beforeEach(() => {
      const element = render(<FilterTab testID="tab" tab={{title}} onPress={() => {}} isActive={true} />);
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const tab = getElementByTestId('tab');
      const tabButton = getElementByTestId(`tab-button-${title}`);
      const tabButtonText = getElementByTestId('tab-button-text');
      const tabButtonIcon = queryElementByTestId('tab-button-icon');

      expect(tab).toBeTruthy();
      expect(stylesToOneObject(tab.props.style).borderBottomColor).toBe(colors.green);
      expect(tabButton).toBeTruthy();
      expect(tabButtonText).toBeTruthy();
      expect(tabButtonText.props.children).toBe(title);
      expect(tabButtonIcon).toBeFalsy();
      expect(stylesToOneObject(tabButtonText.props.style).color).toBe(colors.green);
    });
  });

  describe('FilterTab active with active', () => {
    const title = 'title';
    const icon = 'search';

    let getElementByTestId, queryElementByTestId;
    beforeEach(() => {
      const element = render(<FilterTab testID="tab" tab={{title, icon}} onPress={() => {}} isActive={true} />);
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const tab = getElementByTestId('tab');
      const tabButton = getElementByTestId(`tab-button-${title}`);
      const tabButtonText = getElementByTestId('tab-button-text');
      const tabButtonIcon = queryElementByTestId('tab-button-icon');

      expect(tab).toBeTruthy();
      expect(stylesToOneObject(tab.props.style).borderBottomColor).toBe(colors.green);
      expect(tabButton).toBeTruthy();
      expect(tabButtonText).toBeTruthy();
      expect(tabButtonText.props.children).toBe(title);
      expect(tabButtonIcon).toBeTruthy();
      expect(tabButtonIcon.props.name).toBe(icon);
      expect(tabButtonIcon.props.color).toBe(colors.green);
      expect(stylesToOneObject(tabButtonText.props.style).color).toBe(colors.green);
    });
  });
});
