import {useState} from 'react';
import {renderHook} from '@testing-library/react-hooks';

import {render} from 'ranger-testUtils/testingLibrary';
import {TreeItemUI} from 'screens/GreenBlock/screens/TreeInventory/TreeInventory';
import {NotVerifiedTreeList} from 'components/TreeListV2/NotVerifiedTreeList';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {notVerifiedTreesMock} from 'components/TreeListV2/__test__/NotVerifiedTrees.mock';

describe('NotVerifiedTreeList component', () => {
  it('NotVerifiedTreeList component should be defined', () => {
    expect(NotVerifiedTreeList).toBeDefined();
    expect(typeof NotVerifiedTreeList).toBe('function');
  });
  describe('NotVerifiedTreeList withId', () => {
    let getElementByTestId, queryElementByTestId;
    const {
      result: {current},
    } = renderHook(() => useState(TreeItemUI.WithId));

    const [treeItemUI, setTreeITemUI] = current;

    beforeEach(() => {
      const element = render(
        <NotVerifiedTreeList
          treeItemUI={treeItemUI}
          setTreeItemUI={setTreeITemUI}
          notVerifiedTrees={notVerifiedTreesMock}
        />,
        goerliReducers,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('elements/components should be defined', () => {
      const selectTreeItemSizeContainer = getElementByTestId('select-tree-item-size');
      const smallButtonSize = getElementByTestId('small-size-button');
      const smallButtonIconSize = getElementByTestId('small-size-icon');
      const bigButtonSize = getElementByTestId('big-size-button');
      const bigButtonIconSize = getElementByTestId('big-size-icon');

      const tabContext = getElementByTestId('tab-trees-context');
      const withIdTab = getElementByTestId('withId-tab');
      const withDetailTab = queryElementByTestId('withDetail-tab');
      const withIdFlatList = getElementByTestId('with-id-flatList');
      const withDetailFlatList = queryElementByTestId('with-detail-flatList');

      expect(selectTreeItemSizeContainer).toBeTruthy();
      expect(smallButtonSize).toBeTruthy();
      expect(smallButtonIconSize).toBeTruthy();
      expect(smallButtonIconSize.props.name).toBe('th');
      expect(bigButtonSize).toBeTruthy();
      expect(bigButtonIconSize).toBeTruthy();
      expect(bigButtonIconSize.props.name).toBe('th-large');

      expect(tabContext).toBeTruthy();
      expect(withIdTab).toBeTruthy();
      expect(withDetailTab).toBeFalsy();

      expect(withIdFlatList).toBeTruthy();
      expect(withIdFlatList.props.data).toEqual(notVerifiedTreesMock);
      expect(withDetailFlatList).toBeFalsy();
    });
  });
});
