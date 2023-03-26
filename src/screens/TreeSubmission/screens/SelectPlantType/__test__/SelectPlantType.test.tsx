import SelectPlantType from 'screens/TreeSubmission/screens/SelectPlantType';
import {render} from '@testing-library/react-native';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';

const mockPlantTreePermissions: TUsePlantTreePermissions = {
  cameraPermission: 'blocked',
  locationPermission: 'blocked',
  userLocation: null,
  checkPermission: () => {},
  requestPermission: () => {},
  checkUserLocation: () => {},
  openPermissionsSettings: (isGranted?: boolean) => {},
  openGpsRequest: (isGranted?: boolean) => {},
  requestCameraPermission: (isGranted?: boolean) => {},
  requestLocationPermission: (isGranted?: boolean) => {},
  isCameraBlocked: true,
  isLocationBlocked: true,
  isCameraGranted: false,
  isLocationGranted: false,
  isGPSEnabled: false,
  hasLocation: false,
  isChecking: false,
  isGranted: false,
  cantProceed: true,
  requested: true,
  showPermissionModal: true,
};

describe('SelectPlantType page', () => {
  it('select plant type page should be defined', () => {
    expect(SelectPlantType).toBeDefined();
    expect(typeof SelectPlantType).toBe('function');
  });

  let getElementByTestId, queryElementByTestId, findElementByTestId;
  beforeEach(() => {
    const element = render(
      <SelectPlantType
        navigation={jest.fn() as any}
        route={jest.fn() as any}
        plantTreePermissions={mockPlantTreePermissions}
      />,
    );
    getElementByTestId = element.getByTestId;
    queryElementByTestId = element.queryByTestId;
    findElementByTestId = element.findByTestId;
  });
});
