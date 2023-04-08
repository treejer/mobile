import {MapMarkingV2} from 'screens/TreeSubmissionV2/components/MapMarkingV2/MapMarkingV2';
import {render} from 'ranger-testUtils/testingLibrary';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';

describe('MapMarkingV2 component', () => {
  it('MapMarkingV2 component should be defined', () => {
    expect(MapMarkingV2).toBeDefined();
    expect(typeof MapMarkingV2).toBe('function');
  });

  describe('MapMarking', () => {
    let getElementByTestId, queryElementByTestId;
    beforeEach(() => {
      const element = render(
        <MapMarkingV2
          testID="map-marking-cpt"
          userLocation={{
            longitude: 22222,
            latitude: 2000,
          }}
          permissionHasLocation={true}
        />,
        goerliReducers,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const mapCpt = getElementByTestId('map-cpt');
      const dismissBtn = queryElementByTestId('dismiss-btn');
      const submitBtn = queryElementByTestId('submit-btn');
      const mapDetail = queryElementByTestId('map-detail');
      const mapController = queryElementByTestId('map-controller-cpt');

      expect(mapCpt).toBeTruthy();
      expect(dismissBtn).toBeFalsy();
      expect(submitBtn).toBeFalsy();
      expect(mapDetail).toBeFalsy();
      expect(mapController).toBeFalsy();
    });
  });
});
