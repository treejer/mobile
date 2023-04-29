import {useState} from 'react';
import {renderHook} from '@testing-library/react-hooks';

import {TreeItemUI} from 'screens/GreenBlock/screens/TreeInventory/TreeInventory';
import {TreeListV2} from 'components/TreeListV2/TreeListV2';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {verifiedTress} from 'components/TreeListV2/__test__/TreeListV2.mock';
import {render} from 'ranger-testUtils/testingLibrary';

describe('TreeListV2', () => {
  it('TreeListV2 component should be defined', () => {
    expect(TreeListV2).toBeDefined();
    expect(typeof TreeListV2).toBe('function');
  });

  describe('TreeListV2 withId', () => {
    const {
      result: {current},
    } = renderHook(() => useState(TreeItemUI.WithId));

    const [treeItemUI, setTreeITemUI] = current;

    let getElementByTestId, queryElementByTestId;
    beforeEach(() => {
      const element = render(
        <TreeListV2
          treeItemUI={treeItemUI}
          setTreeItemUI={setTreeITemUI}
          verifiedTrees={verifiedTress as any}
          treeUpdateInterval={20}
        />,
        goerliReducers,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
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
      expect(withIdFlatList.props.data).toEqual(verifiedTress);
      expect(withDetailFlatList).toBeFalsy();
    });
  });
  describe('TreeListV2 withDetail', () => {
    const {
      result: {current},
    } = renderHook(() => useState(TreeItemUI.WithDetail));

    const [treeItemUI, setTreeITemUI] = current;

    let getElementByTestId, queryElementByTestId;
    beforeEach(() => {
      const element = render(
        <TreeListV2
          treeItemUI={treeItemUI}
          setTreeItemUI={setTreeITemUI}
          verifiedTrees={verifiedTress as any}
          treeUpdateInterval={20}
        />,
        goerliReducers,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const selectTreeItemSizeContainer = getElementByTestId('select-tree-item-size');
      const smallButtonSize = getElementByTestId('small-size-button');
      const smallButtonIconSize = getElementByTestId('small-size-icon');
      const bigButtonSize = getElementByTestId('big-size-button');
      const bigButtonIconSize = getElementByTestId('big-size-icon');
      const tabContext = getElementByTestId('tab-trees-context');
      const withIdTab = queryElementByTestId('withId-tab');
      const withDetailTab = getElementByTestId('withDetail-tab');
      const withIdFlatList = queryElementByTestId('with-id-flatList');
      const withDetailFlatList = getElementByTestId('with-detail-flatList');

      expect(selectTreeItemSizeContainer).toBeTruthy();
      expect(smallButtonSize).toBeTruthy();
      expect(smallButtonIconSize).toBeTruthy();
      expect(smallButtonIconSize.props.name).toBe('th');
      expect(bigButtonSize).toBeTruthy();
      expect(bigButtonIconSize).toBeTruthy();
      expect(bigButtonIconSize.props.name).toBe('th-large');

      expect(tabContext).toBeTruthy();
      expect(withIdTab).toBeFalsy();
      expect(withDetailTab).toBeTruthy();

      expect(withDetailFlatList).toBeTruthy();
      expect(withDetailFlatList.props.data).toEqual(verifiedTress);
      expect(withIdFlatList).toBeFalsy();
    });
  });
  describe('TreeListV2 loading = true', () => {
    const {
      result: {current},
    } = renderHook(() => useState(TreeItemUI.WithDetail));

    const [treeItemUI, setTreeITemUI] = current;

    let getElementByTestId, queryElementByTestId;
    beforeEach(() => {
      const element = render(
        <TreeListV2
          treeItemUI={treeItemUI}
          setTreeItemUI={setTreeITemUI}
          verifiedTrees={verifiedTress as any}
          treeUpdateInterval={20}
          loading={true}
        />,
        goerliReducers,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const selectTreeItemSizeContainer = getElementByTestId('select-tree-item-size');
      const smallButtonSize = getElementByTestId('small-size-button');
      const smallButtonIconSize = getElementByTestId('small-size-icon');
      const bigButtonSize = getElementByTestId('big-size-button');
      const bigButtonIconSize = getElementByTestId('big-size-icon');

      const loading = getElementByTestId('tree-list-v2-loading');

      expect(selectTreeItemSizeContainer).toBeTruthy();
      expect(smallButtonSize).toBeTruthy();
      expect(smallButtonIconSize).toBeTruthy();
      expect(smallButtonIconSize.props.name).toBe('th');
      expect(bigButtonSize).toBeTruthy();
      expect(bigButtonIconSize).toBeTruthy();
      expect(bigButtonIconSize.props.name).toBe('th-large');

      expect(loading).toBeTruthy();
    });
  });
});
