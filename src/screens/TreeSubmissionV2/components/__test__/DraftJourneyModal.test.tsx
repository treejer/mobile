import {act, fireEvent, render, waitFor} from 'ranger-testUtils/testingLibrary';
import moment from 'moment';

import {DraftJourneyModal} from 'screens/TreeSubmissionV2/components/DraftJourneyModal/DraftJourneyModal';
import {DraftType} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {capitalize} from 'utilities/helpers/capitalize';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';

describe('DraftJourneyModal component', () => {
  it('DraftJourneyModal should be defined', () => {
    expect(DraftJourneyModal).toBeDefined();
    expect(typeof DraftJourneyModal).toBe('function');
  });
  describe('DraftJourneyModal', () => {
    let getElementByTestId;

    const draftId = new Date(jest.now());
    const locale = 'en';

    beforeEach(() => {
      const element = render(
        <DraftJourneyModal
          testID="draft-modal"
          isSingle={true}
          draft={{id: draftId, draftType: DraftType.Draft}}
          onSubmit={() => {}}
          onCancel={() => {}}
        />,
        {
          ...goerliReducers,
          settings: {
            ...goerliReducers.settings,
            locale,
          },
        },
      );
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const modal = getElementByTestId('draft-modal');
      const title = getElementByTestId('draft-title');
      const input = getElementByTestId('draft-input');
      const cancelBtn = getElementByTestId('cancel-btn');
      const cancelBtnTxt = getElementByTestId('cancel-btn-text');
      const submitBtn = getElementByTestId('submit-btn');
      const submitBtnTxt = getElementByTestId('submit-btn-text');

      expect(modal).toBeTruthy();
      expect(title).toBeTruthy();
      expect(title.props.children).toBe('submitTreeV2.titles.draft');
      expect(input).toBeTruthy();
      expect(input.props.placeholder).toBe(
        `${capitalize(DraftType.Draft)} ${moment(draftId)
          .locale(locale.toLowerCase())
          .format('YYYY-MM-DD hh:mm:ss a')}`,
      );
      expect(cancelBtn).toBeTruthy();
      expect(cancelBtnTxt.props.children).toBe('cancel');
      expect(submitBtn).toBeTruthy();
      expect(submitBtnTxt.props.children).toBe('submit');
    });

    it('type in draft input', async () => {
      const newName = 'Name';

      const input = getElementByTestId('draft-input');

      expect(input.props.value).toBe('');

      await act(async () => {
        await fireEvent.changeText(input, newName);
      });
      await waitFor(() => {
        expect(input.props.value).toBe(newName);
      });
    });
  });
});
