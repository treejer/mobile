import {render, act, waitFor, fireEvent, screen} from 'ranger-testUtils/testingLibrary';
import {TestSubmissionStack} from 'ranger-testUtils/components/TestSubmissionStack/TestSubmissionStack';

import {Routes} from 'navigation/Navigation';
import {EmptyTreeList} from 'screens/GreenBlock/components/EmptyTreeList/EmptyTreeList';
import {TreeInventory} from 'screens/GreenBlock/screens/TreeInventory/TreeInventory';
import {reducersWithDraftsAndTreeList} from 'screens/GreenBlock/screens/__test__/TreeInventory.mock';

describe('EmptyTreeList component', () => {
  it('EmptyTreeList component should be defined', () => {
    expect(EmptyTreeList).toBeDefined();
    expect(typeof EmptyTreeList).toBe('function');
  });

  describe('EmptyTreeList component', () => {
    let getElementByTestId, getAllByTestId;

    beforeEach(() => {
      const element = render(
        <TestSubmissionStack stack={Routes.GreenBlock} name={Routes.TreeInventory_V2} component={<TreeInventory />} />,
        {
          ...reducersWithDraftsAndTreeList,
          submittedTrees: {
            data: {
              data: [],
              hasMore: false,
            },
            hasMore: false,
            loading: false,
            loaded: true,
            error: null,
          },
        },
      );
      getElementByTestId = element.findByTestId;
      getAllByTestId = element.getAllByTestId;
    });

    it('components/elements should be defined', async () => {
      const emptyListCpt = await getElementByTestId('empty-list-cpt');
      const startPlantButton = await getElementByTestId('start-plant-btn');
      const visitNotVerifiedButton = await getElementByTestId('visit-notVerified-btn');
      const backProfileButton = await getElementByTestId('back-profile-btn');

      expect(emptyListCpt).toBeTruthy();
      expect(startPlantButton).toBeTruthy();
      expect(visitNotVerifiedButton).toBeTruthy();
      expect(backProfileButton).toBeTruthy();
    });

    it('should navigate to TreeSubmission_V2', async () => {
      const startPlantButton = await getElementByTestId('start-plant-btn');

      await act(async () => {
        await fireEvent.press(startPlantButton);
      });

      await waitFor(async () => {
        const startPlantButton = screen.queryByTestId('start-plant-btn');
        const selectPlantType = screen.getByTestId('single-tree-btn-cpt');
        expect(selectPlantType).toBeTruthy();
        expect(startPlantButton).toBeFalsy();
      });
    });
  });
});
