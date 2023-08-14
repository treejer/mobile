import {render} from '@testing-library/react-native';
import {View} from 'react-native';

import {Tabs} from 'components/Tabs/Tabs';
import {Tab} from 'components/Tabs/Tab';

describe('Tabs component', () => {
  it('Tabs component should be defined', () => {
    expect(Tabs).toBeDefined();
    expect(typeof Tabs).toBe('function');
    expect(Tab).toBeDefined();
    expect(typeof Tab).toBe('function');
  });

  describe('Tabs should render correct Tab', () => {
    let getElementByTestId, queryElementByTestId;
    const currentTab = 'TAB_ONE';
    beforeEach(() => {
      const element = render(
        <Tabs testID="tab-context" tab={currentTab}>
          <Tab testID="tab-one" tab={currentTab}>
            <View></View>
          </Tab>
          <Tab testID="tab-two" tab="TAB_TWO">
            <View></View>
          </Tab>
        </Tabs>,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('should render TAB_ONE', () => {
      const tabContext = getElementByTestId('tab-context');
      const tabOne = getElementByTestId('tab-one');
      const tabTwo = queryElementByTestId('tab-two');

      expect(tabContext).toBeTruthy();
      expect(tabOne).toBeTruthy();
      expect(tabTwo).toBeFalsy();
    });
  });
});
