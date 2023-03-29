import SelectPlantType from 'screens/TreeSubmission/screens/SelectPlantType';
import {render} from 'ranger-testUtils/testingLibrary';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {act, fireEvent, waitFor, screen} from '@testing-library/react-native';

describe('SelectPlantType screen', () => {
  it('select plant type page should be defined', () => {
    expect(SelectPlantType).toBeDefined();
    expect(typeof SelectPlantType).toBe('function');
  });

  describe('SelectPlantType', () => {
    let getElementByTestId, queryElementByTestId, findElementByTestId;
    beforeEach(() => {
      const element = render(
        <SelectPlantType navigation={jest.fn() as any} route={jest.fn() as any} />,
        goerliReducers,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
      findElementByTestId = element.findByTestId;
    });

    it('components/elements should be defined', () => {
      const singleTreeBtn = getElementByTestId('single-tree-btn-cpt');
      const nurseryBtn = getElementByTestId('nursery-btn-cpt');
      const toPlantSingleBtn = queryElementByTestId('single-submit-tree');
      const toPlantNurseryBtn = queryElementByTestId('nursery-submit-tree');

      expect(singleTreeBtn).toBeTruthy();
      expect(nurseryBtn).toBeTruthy();
      expect(toPlantSingleBtn).toBeFalsy();
      expect(toPlantNurseryBtn).toBeFalsy();
    });

    it('single to plant button should be defined after select its button', async () => {
      const singleTreeBtn = getElementByTestId('single-tree-btn-cpt');

      await act(async () => {
        await fireEvent.press(singleTreeBtn);
      });
      await waitFor(() => {
        const toPlantSingleBtn = getElementByTestId('single-submit-tree');
        expect(toPlantSingleBtn).toBeTruthy();
      });
    });

    it('nursery to plant button should be defined after select its button', async () => {
      const nurseryBtn = getElementByTestId('nursery-btn-cpt');
      const countInput = getElementByTestId('count-input');

      await act(async () => {
        await fireEvent.press(nurseryBtn);
        await fireEvent.changeText(countInput, 2);
      });
      await waitFor(async () => {
        const submissionHeader = await screen.getByTestId('select-photo-header');
        const toPlantNurseryBtn = queryElementByTestId('nursery-submit-tree');
        expect(countInput.props.value).toBe('2');
        expect(toPlantNurseryBtn).toBeTruthy();
        expect(submissionHeader).toBeTruthy();
      });
    });
  });
});
