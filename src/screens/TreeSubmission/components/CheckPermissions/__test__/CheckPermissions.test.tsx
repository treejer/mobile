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
    let getElementByTestId;

    beforeEach(async () => {
      const element = render(<CheckPermissions plantTreePermissions={mockPlantTreePermissions} />);
      getElementByTestId = element.getByTestId;
    });

    it('BlockedPermissions should be defined', () => {
      const blockedPermissionsCpt = getElementByTestId('blocked-permissions-cpt');
      expect(blockedPermissionsCpt).toBeTruthy();
    });

    it('CheckingPermissions always should be defined', () => {
      const CheckingPermissionsCpt = getElementByTestId('checking-permissions-cpt');
      expect(CheckingPermissionsCpt).toBeTruthy();
    });
  });
});
