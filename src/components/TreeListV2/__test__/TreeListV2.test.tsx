import {TreeListV2} from 'components/TreeListV2/TreeListV2';
import {render} from 'ranger-testUtils/testingLibrary';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';

describe('TreeListV2', () => {
  it('TreeListV2 component should be defined', () => {
    expect(TreeListV2).toBeDefined();
    expect(typeof TreeListV2).toBe('function');
  });

  describe('TreeListV2', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(<TreeListV2 />, goerliReducers);
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const selectTreeItemSizeContainer = getElementByTestId('select-tree-item-size');
      const smallButtonSize = getElementByTestId('small-size-button');
      const smallButtonIconSize = getElementByTestId('small-size-icon');
      const bigButtonSize = getElementByTestId('big-size-button');
      const bigButtonIconSize = getElementByTestId('big-size-icon');

      expect(selectTreeItemSizeContainer).toBeTruthy();
      expect(smallButtonSize).toBeTruthy();
      expect(smallButtonIconSize).toBeTruthy();
      expect(smallButtonIconSize.props.name).toBe('th');
      expect(bigButtonSize).toBeTruthy();
      expect(bigButtonIconSize).toBeTruthy();
      expect(bigButtonIconSize.props.name).toBe('th-large');
    });
  });
});
