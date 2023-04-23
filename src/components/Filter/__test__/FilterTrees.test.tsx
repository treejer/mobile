import {render} from '@testing-library/react-native';

import {FilterTrees} from 'components/Filter/FilterTrees';
import {TreeStatus} from 'utilities/helpers/treeInventory';
import {colors} from 'constants/values';

describe('FilterTrees component', () => {
  it('FilterTrees component should be defined', () => {
    expect(FilterTrees).toBeDefined();
    expect(typeof FilterTrees).toBe('function');
  });

  describe('FilterTrees', () => {
    let getElementByTestId;

    const mockFilters = [
      {
        title: TreeStatus.Verified,
        count: 20,
        color: colors.green,
      },
      {
        title: TreeStatus.Pending,
        count: 15,
        color: colors.pink,
      },
      {
        title: TreeStatus.Update,
        count: 42,
        color: colors.gray,
      },
    ];

    beforeEach(() => {
      const element = render(
        <FilterTrees
          testID="filter-trees-cpt"
          filterList={mockFilters}
          filters={[TreeStatus.Update]}
          onFilter={() => {}}
        />,
      );
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const filterTreesList = getElementByTestId('filter-trees-cpt');

      expect(filterTreesList).toBeTruthy();
      expect(filterTreesList.props.children.length).toBe(mockFilters.length);
    });
  });
});
