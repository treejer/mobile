import {render, act, fireEvent, waitFor, screen} from 'ranger-testUtils/testingLibrary';
import {TreeInventory} from 'screens/GreenBlock/screens/TreeInventory/TreeInventory';
import {reducersWithDraftsAndTreeList} from 'screens/GreenBlock/screens/__test__/TreeInventory.mock';
import {TreeLife} from 'utilities/helpers/treeInventory';
import {notVerifiedTreesMock} from 'components/TreeListV2/__test__/NotVerifiedTrees.mock';
import {submittedTreesMock} from 'ranger-redux/modules/__test__/trees/submittedTrees.mock';

describe('TreeInventory component', () => {
  it('TreeInventory component should be defined', () => {
    expect(TreeInventory).toBeDefined();
    expect(typeof TreeInventory).toBe('function');
  });

  describe('TreeInventory', () => {
    let getElementByTestId, queryElementByTestId;
    beforeEach(() => {
      const element = render(<TreeInventory />, reducersWithDraftsAndTreeList);
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('component/elements should be defined', () => {
      const screenTitle = getElementByTestId('screen-title-cpt');
      const screenTitleTxt = getElementByTestId('screen-title-text');
      const filterByType = getElementByTestId('filter-tab-cpt');
      const searchButton = getElementByTestId('search-button-cpt');

      const tabContext = getElementByTestId('tab-context');
      const submittedTab = getElementByTestId('submitted-tab');
      const draftedTab = queryElementByTestId('drafted-tab');
      const notVerifiedTab = queryElementByTestId('notVerified-tab');

      expect(screenTitle).toBeTruthy();
      expect(screenTitleTxt).toBeTruthy();
      expect(screenTitleTxt.props.children).toBe('treeInventoryV2.titles.screen');
      expect(filterByType).toBeTruthy();
      expect(searchButton).toBeTruthy();

      expect(tabContext).toBeTruthy();
      expect(submittedTab).toBeTruthy();
      expect(draftedTab).toBeFalsy();
      expect(notVerifiedTab).toBeFalsy();
    });

    it('TreeList length should be 2', async () => {
      const treeListV2 = await screen.findByTestId('with-id-flatList');
      expect(treeListV2.props.data).toEqual(submittedTreesMock.data);
      expect(treeListV2.props.data.length).toEqual(submittedTreesMock.data.length);
    });

    it('SearchInInventory component should visible', async () => {
      const searchButton = getElementByTestId('search-button-cpt');

      await act(async () => {
        await fireEvent.press(searchButton);
      });
      await waitFor(() => {
        const searchInInventory = getElementByTestId('search-in-inventory-cpt');
        expect(searchInInventory).toBeTruthy();
      });
      const closeButton = getElementByTestId('close-button');
      await act(async () => {
        await fireEvent.press(closeButton);
      });
      await waitFor(() => {
        const searchInInventory = queryElementByTestId('search-in-inventory-cpt');
        expect(searchInInventory).toBeFalsy();
        const screenTitle = getElementByTestId('screen-title-cpt');
        const searchButton = getElementByTestId('search-button-cpt');
        expect(screenTitle).toBeTruthy();
        expect(searchButton).toBeTruthy();
      });
    });
    it('Tab should change', async () => {
      const tabContext = getElementByTestId('tab-context');
      const submittedTab = getElementByTestId('submitted-tab');
      const draftedTab = queryElementByTestId('drafted-tab');
      const notVerifiedTab = queryElementByTestId('notVerified-tab');

      const tabDraftedButton = getElementByTestId(`tab-button-${TreeLife.Drafted}`);
      const tabSubmittedButton = getElementByTestId(`tab-button-${TreeLife.Submitted}`);
      const tabNotVerifiedButton = getElementByTestId(`tab-button-${TreeLife.NotVerified}`);

      expect(tabContext).toBeTruthy();
      expect(submittedTab).toBeTruthy();
      expect(draftedTab).toBeFalsy();
      expect(notVerifiedTab).toBeFalsy();
      expect(tabDraftedButton).toBeTruthy();
      expect(tabSubmittedButton).toBeTruthy();
      expect(tabNotVerifiedButton).toBeTruthy();

      await act(async () => {
        await fireEvent.press(tabDraftedButton, TreeLife.Drafted);
      });
      await waitFor(() => {
        const notVerifiedTab = queryElementByTestId('notVerified-tab');
        const submittedTab = queryElementByTestId('submitted-tab');
        const draftedTab = getElementByTestId('drafted-tab');

        expect(notVerifiedTab).toBeFalsy();
        expect(submittedTab).toBeFalsy();
        expect(draftedTab).toBeTruthy();

        const draftListCpt = getElementByTestId('draft-list-cpt');
        expect(draftListCpt).toBeTruthy();
      });

      await act(async () => {
        await fireEvent.press(tabSubmittedButton, TreeLife.Submitted);
      });
      await waitFor(() => {
        const submittedTab = getElementByTestId('submitted-tab');
        const draftedTab = queryElementByTestId('drafted-tab');
        const notVerifiedTab = queryElementByTestId('notVerified-tab');

        expect(submittedTab).toBeTruthy();
        expect(draftedTab).toBeFalsy();
        expect(notVerifiedTab).toBeFalsy();
      });

      await act(async () => {
        await fireEvent.press(tabNotVerifiedButton, TreeLife.NotVerified);
      });
      await waitFor(() => {
        const submittedTab = queryElementByTestId('submitted-tab');
        const draftedTab = queryElementByTestId('drafted-tab');
        const notVerifiedTab = getElementByTestId('notVerified-tab');

        expect(notVerifiedTab).toBeTruthy();
        expect(submittedTab).toBeFalsy();
        expect(draftedTab).toBeFalsy();
      });
    });

    it('Tab = TreeLife.Submitted', () => {
      const submittedTab = getElementByTestId('submitted-tab');
      const draftedTab = queryElementByTestId('drafted-tab');
      const filterTreesCpt = getElementByTestId('filter-submitted-trees-cpt');
      const treeListV2 = getElementByTestId('submitted-tree-list-v2');

      expect(submittedTab).toBeTruthy();
      expect(draftedTab).toBeFalsy();
      expect(filterTreesCpt).toBeTruthy();
      expect(treeListV2).toBeTruthy();
    });
    it('Tab = TreeLife.Drafted', async () => {
      const tabDraftedButton = getElementByTestId(`tab-button-${TreeLife.Drafted}`);

      await act(async () => {
        await fireEvent.press(tabDraftedButton, TreeLife.Drafted);
      });
      const submittedTab = queryElementByTestId('submitted-tab');
      const draftedTab = getElementByTestId('drafted-tab');
      const filterTreesCpt = queryElementByTestId('filter-submitted-trees-cpt');
      const draftList = getElementByTestId('draft-list-cpt');

      expect(submittedTab).toBeFalsy();
      expect(draftedTab).toBeTruthy();
      expect(filterTreesCpt).toBeFalsy();
      expect(draftList).toBeTruthy();
    });
    it('Tab = TreeLife.NotVerified', async () => {
      const tabNotVerifiedButton = getElementByTestId(`tab-button-${TreeLife.NotVerified}`);
      await act(async () => {
        await fireEvent.press(tabNotVerifiedButton, TreeLife.NotVerified);
      });
      const submittedTab = queryElementByTestId('submitted-tab');
      const draftedTab = queryElementByTestId('drafted-tab');
      const notVerifiedTreeList = getElementByTestId('notVerified-tree-list');
      const filterNotVerifiedTrees = getElementByTestId('filter-notVerified-trees-cpt');

      const notVerifiedTreeFlashList = await screen.findByTestId('with-id-flatList');

      expect(submittedTab).toBeFalsy();
      expect(draftedTab).toBeFalsy();
      expect(notVerifiedTreeList).toBeTruthy();
      expect(filterNotVerifiedTrees).toBeTruthy();

      expect(notVerifiedTreeFlashList).toBeTruthy();

      expect(notVerifiedTreeFlashList.props.data).toEqual(notVerifiedTreesMock);
      expect(notVerifiedTreeFlashList.props.data.length).toEqual(notVerifiedTreesMock.length);
    });
  });
});
