import {SelectOnMapV2} from 'screens/TreeSubmissionV2/screens/SelectOnMapV2/SelectOnMapV2';
import {TestSubmissionStack} from 'ranger-testUtils/components/TestSubmissionStack/TestSubmissionStack';
import {Routes} from 'navigation/Navigation';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {mockPlantTreePermissionsGranted} from 'screens/TreeSubmissionV2/components/__test__/mock';
import {render} from 'ranger-testUtils/testingLibrary';

describe('SelectOnMapV2 component', () => {
  it('SelectOnMapV2 should be defined', () => {
    expect(SelectOnMapV2).toBeDefined();
    expect(typeof SelectOnMapV2).toBe('function');
  });
  describe('SelectOnMapV2', () => {
    let getElementByTestId, queryElementByTestId;
    beforeEach(() => {
      const element = render(
        <TestSubmissionStack
          name={Routes.SelectOnMap_V2}
          component={<SelectOnMapV2 plantTreePermissions={mockPlantTreePermissionsGranted} />}
        />,
        goerliReducers,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });
    it('components/elements should be defined', () => {
      const mapMarker = getElementByTestId('map-marker');
      const mapMarkingCpt = getElementByTestId('map-marking-cpt');
      const offlineModal = queryElementByTestId('offline-modal');

      expect(mapMarker).toBeTruthy();
      expect(mapMarkingCpt).toBeTruthy();
      expect(offlineModal).toBeFalsy();
    });
  });
});
