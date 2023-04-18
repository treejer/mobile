import {render} from 'ranger-testUtils/testingLibrary';
import {DraftList} from 'components/Draft/DraftList';
import {draftListReducers} from 'components/Draft/__test__/DratList.mock';

describe('DraftList component', () => {
  it('DraftList component should be defined', () => {
    expect(DraftList).toBeDefined();
    expect(typeof DraftList).toBe('function');
  });

  describe('DraftList', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(<DraftList testID="draft-list-cpt" />, draftListReducers);
      getElementByTestId = element.getByTestId;
    });

    it('component/elements should be defined', () => {
      const draftListCpt = getElementByTestId('draft-list-cpt');
      const draftFlashList = getElementByTestId('draft-list');

      expect(draftListCpt).toBeTruthy();
      expect(draftFlashList).toBeTruthy();
      expect(draftFlashList.props.data.length).toBe(2);
    });
  });
});
