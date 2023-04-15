import {render} from '@testing-library/react-native';

import {FilterTabBar} from 'components/Filter/FilterTabBar';
import {treeInventoryTabs} from 'utilities/helpers/treeInventory';

describe('FilterTabBar component', () => {
  it('FilterTabBar component should be defined', () => {
    expect(FilterTabBar).toBeDefined();
    expect(typeof FilterTabBar).toBe('function');
  });

  describe('FilterTab', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(
        <FilterTabBar
          testID="tab-bar-cpt"
          tabs={treeInventoryTabs}
          activeTab={treeInventoryTabs[0].title}
          onChange={() => {}}
        />,
      );
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const tabBar = getElementByTestId('tab-bar-cpt');
      expect(tabBar).toBeTruthy();

      expect(tabBar.props.children.length).toBe(treeInventoryTabs.length);
    });
  });
});
