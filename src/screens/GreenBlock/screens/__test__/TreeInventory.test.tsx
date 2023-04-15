import {render} from 'ranger-testUtils/testingLibrary';
import {TreeInventory} from 'screens/GreenBlock/screens/TreeInventory/TreeInventory';
import {reducersWithDraftsAndTreeList} from 'screens/GreenBlock/screens/__test__/TreeInventory.mock';

describe('TreeInventory component', () => {
  it('TreeInventory component should be defined', () => {
    expect(TreeInventory).toBeDefined();
    expect(typeof TreeInventory).toBe('function');
  });

  describe('TreeInventory', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(<TreeInventory />, reducersWithDraftsAndTreeList);
      getElementByTestId = element.getByTestId;
    });

    it('component/elements should be defined', () => {
      const screenTitle = getElementByTestId('screen-title-cpt');
      const screenTitleTxt = getElementByTestId('screen-title-text');
      const filterByType = getElementByTestId('filter-tab-cpt');
      const searchButton = getElementByTestId('search-button-cpt');

      expect(screenTitle).toBeTruthy();
      expect(screenTitleTxt).toBeTruthy();
      expect(screenTitleTxt.props.children).toBe('treeInventoryV2.titles.screen');
      expect(filterByType).toBeTruthy();
      expect(searchButton).toBeTruthy();
    });
  });
});
