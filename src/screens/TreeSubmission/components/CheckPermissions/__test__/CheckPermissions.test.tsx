import CheckPermissions from 'screens/TreeSubmission/components/CheckPermissions/CheckPermissions';
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

describe('CheckPermissions component', () => {
  it('CheckPermissions component should exist', () => {
    expect(CheckPermissions).toBeDefined();
    expect(typeof CheckPermissions).toBe('function');
  });

  describe('check permissions', () => {
    let getElementByTestId, queryElementByTestId;

    beforeEach(async () => {
      const element = render(<CheckPermissions plantTreePermissions={mockPlantTreePermissions} />);
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('BlockedPermissions should be defined in cant proceed state', () => {
      const blockedPermissionsCpt = queryElementByTestId('blocked-permissions-cpt');
      if (mockPlantTreePermissions.cantProceed) {
        expect(blockedPermissionsCpt).toBeTruthy();
      } else {
        expect(blockedPermissionsCpt).toBeFalsy();
      }
    });

    it('CheckingPermissions always should be defined', () => {
      const CheckingPermissionsCpt = getElementByTestId('checking-permissions-cpt');
      expect(CheckingPermissionsCpt).toBeTruthy();
    });
  });
});
