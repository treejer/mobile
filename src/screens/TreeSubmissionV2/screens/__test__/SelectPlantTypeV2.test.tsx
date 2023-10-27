import {act, screen, fireEvent, waitFor} from '@testing-library/react-native';

import {render} from 'ranger-testUtils/testingLibrary';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {SelectPlantTypeV2} from 'screens/TreeSubmissionV2/screens/SelectPlantTypeV2/SelectPlantTypeV2';
import {TestSubmissionStack} from 'ranger-testUtils/components/TestSubmissionStack/TestSubmissionStack';
import {Routes} from 'navigation/Navigation';

jest.mock('../../../../utilities/hooks/useUserRole', () => {
  return {
    useUserRole: () => ({
      hasRole: true,
      loading: false,
    }),
  };
});

describe('SelectPlantTypeV2 screen', () => {
  it('select plant type page should be defined', () => {
    expect(SelectPlantTypeV2).toBeDefined();
    expect(typeof SelectPlantTypeV2).toBe('function');
  });

  describe('SelectPlantTypeV2', () => {
    let getElementByTestId, queryElementByTestId, findElementByTestId;
    beforeEach(() => {
      const element = render(
        <TestSubmissionStack name={Routes.SelectPlantType_V2} component={<SelectPlantTypeV2 />} />,
        {
          ...goerliReducers,
          currentJourney: {
            isSingle: true,
          },
        },
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
      await waitFor(async () => {
        const checkPermissionBox = await screen.getByTestId('check-permissions-box');
        // const toPlantSingleBtn = getElementByTestId('single-submit-tree');

        // expect(toPlantSingleBtn).toBeTruthy();
        expect(checkPermissionBox).toBeTruthy();
      });
    });

    it('nursery to plant button should be defined after select its button', async () => {
      const nurseryBtn = getElementByTestId('nursery-btn-cpt');
      const countInput = getElementByTestId('count-input');
      let toPlantNurseryBtn;
      await act(async () => {
        await fireEvent.press(nurseryBtn);
        await fireEvent.changeText(countInput, 2);
      });
      await waitFor(async () => {
        toPlantNurseryBtn = queryElementByTestId('nursery-submit-tree');
        expect(countInput.props.value).toBe('2');
        expect(toPlantNurseryBtn).toBeTruthy();
      });

      await act(async () => {
        await fireEvent.press(toPlantNurseryBtn);
      });
      await waitFor(async () => {
        const checkPermissionBox = await screen.getByTestId('check-permissions-box');
        // const toPlantSingleBtn = getElementByTestId('single-submit-tree');

        // expect(toPlantSingleBtn).toBeTruthy();
        expect(checkPermissionBox).toBeTruthy();
      });
    });
  });
});
