import {render} from 'ranger-testUtils/testingLibrary';
import {TreeInventory} from 'screens/GreenBlock/screens/TreeInventory/TreeInventory';
import {reducersWithDraftsAndTreeList} from 'screens/GreenBlock/screens/__test__/TreeInventory.mock';
import {act, fireEvent, waitFor} from '@testing-library/react-native';
import {TreeLife} from 'utilities/helpers/treeInventory';

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

      expect(screenTitle).toBeTruthy();
      expect(screenTitleTxt).toBeTruthy();
      expect(screenTitleTxt.props.children).toBe('treeInventoryV2.titles.screen');
      expect(filterByType).toBeTruthy();
      expect(searchButton).toBeTruthy();

      expect(tabContext).toBeTruthy();
      expect(submittedTab).toBeTruthy();
      expect(draftedTab).toBeFalsy();
    });
    it('Tab should change', async () => {
      const tabContext = getElementByTestId('tab-context');
      const submittedTab = getElementByTestId('submitted-tab');
      const draftedTab = queryElementByTestId('drafted-tab');

      const tabDraftedButton = getElementByTestId(`tab-button-${TreeLife.Drafted}`);
      const tabSubmittedButton = getElementByTestId(`tab-button-${TreeLife.Submitted}`);

      expect(tabContext).toBeTruthy();
      expect(submittedTab).toBeTruthy();
      expect(draftedTab).toBeFalsy();
      expect(tabDraftedButton).toBeTruthy();

      await act(async () => {
        await fireEvent.press(tabDraftedButton, TreeLife.Drafted);
      });
      await waitFor(() => {
        const submittedTab = queryElementByTestId('submitted-tab');
        const draftedTab = getElementByTestId('drafted-tab');

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

        expect(submittedTab).toBeTruthy();
        expect(draftedTab).toBeFalsy();
      });
    });
  });
});