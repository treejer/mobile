import {render} from 'ranger-testUtils/testingLibrary';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {act, fireEvent, waitFor} from '@testing-library/react-native';
import SelectPlantTypeV2 from 'screens/TreeSubmissionV2/screens/SelectPlantTypeV2/SelectPlantTypeV2';

describe('SelectPlantTypeV2 screen', () => {
  it('select plant type page should be defined', () => {
    expect(SelectPlantTypeV2).toBeDefined();
    expect(typeof SelectPlantTypeV2).toBe('function');
  });

  describe('SelectPlantTypeV2', () => {
    let getElementByTestId, queryElementByTestId, findElementByTestId;
    beforeEach(() => {
      const element = render(<SelectPlantTypeV2 />, goerliReducers);
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
        const toPlantNurseryBtn = queryElementByTestId('nursery-submit-tree');
        expect(countInput.props.value).toBe('2');
        expect(toPlantNurseryBtn).toBeTruthy();
      });
    });
  });
});
