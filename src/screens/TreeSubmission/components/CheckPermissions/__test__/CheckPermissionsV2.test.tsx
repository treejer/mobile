import CheckPermissions from 'screens/TreeSubmission/components/CheckPermissions/CheckPermissions';
import {render} from '@testing-library/react-native';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {CheckPermissionsV2} from 'screens/TreeSubmission/components/CheckPermissions/CheckPermissionsV2';

const mockPlantTreePermissionsBlocked: TUsePlantTreePermissions = {
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

const mockPlantTreePermissionsGranted: TUsePlantTreePermissions = {
  cameraPermission: 'granted',
  locationPermission: 'granted',
  userLocation: {
    latitude: 23213213,
    longitude: 332424324,
  },
  checkPermission: () => {},
  requestPermission: () => {},
  checkUserLocation: () => {},
  openPermissionsSettings: (isGranted?: boolean) => {},
  openGpsRequest: (isGranted?: boolean) => {},
  requestCameraPermission: (isGranted?: boolean) => {},
  requestLocationPermission: (isGranted?: boolean) => {},
  isCameraBlocked: false,
  isLocationBlocked: false,
  isCameraGranted: true,
  isLocationGranted: true,
  isGPSEnabled: true,
  hasLocation: true,
  isChecking: false,
  isGranted: true,
  cantProceed: false,
  requested: true,
  showPermissionModal: false,
};

describe('CheckPermissions component', () => {
  it('CheckPermissions component should exist', () => {
    expect(CheckPermissions).toBeDefined();
    expect(typeof CheckPermissions).toBe('function');
  });

  describe('check permissions = blocked', () => {
    let getElementByTestId, queryElementByTestId;

    beforeEach(async () => {
      const element = render(
        <CheckPermissionsV2 testID="check-permissions-box" plantTreePermissions={mockPlantTreePermissionsBlocked} />,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('permission box title', () => {
      const permissionBoxTitle = getElementByTestId('permission-box-title');
      const permissionBoxIcon = getElementByTestId('permission-box-icon');

      expect(permissionBoxTitle.props.children).toBe('permissionBox.grantToContinue');
      expect(permissionBoxIcon.props.name).toBe('warning');
    });

    it('permissions list length must be 3', () => {
      const permissionsList = getElementByTestId('permissions-list');

      expect(permissionsList.props.children.length).toBe(3);
    });

    it('guide in footer should be defined', () => {
      const guideText = getElementByTestId('permission-box-guide');
      const settingsBox = queryElementByTestId('permission-box-plant-settings');

      expect(guideText.props.i18nKey).toBe('permissionBox.guide');
      expect(settingsBox).toBeFalsy();
    });
  });

  describe('check permissions = granted', () => {
    let getElementByTestId, queryElementByTestId;

    beforeEach(async () => {
      const element = render(
        <CheckPermissionsV2 testID="check-permissions-box" plantTreePermissions={mockPlantTreePermissionsGranted} />,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('permission box title', () => {
      const permissionBoxTitle = getElementByTestId('permission-box-title');
      const permissionBoxIcon = getElementByTestId('permission-box-icon');

      expect(permissionBoxTitle.props.children).toBe('permissionBox.allGranted');
      expect(permissionBoxIcon.props.name).toBe('check-circle');
    });

    it('permissions list length must be 3', () => {
      const permissionsList = queryElementByTestId('permissions-list');

      expect(permissionsList).toBeFalsy();
    });

    it('guide in footer should be invisible', () => {
      const guideText = queryElementByTestId('permission-box-guide');

      expect(guideText).toBeFalsy();
    });

    it('submission settings section should be defined', () => {
      const settingsBox = getElementByTestId('permission-box-plant-settings');
      const openSettingsText = getElementByTestId('permission-box-open-settings-text');
      const settingsIcon = getElementByTestId('settings-icon');
      const chevronIcon = getElementByTestId('settings-chevron-icon');

      expect(settingsBox).toBeTruthy();
      expect(openSettingsText).toBeTruthy();
      expect(settingsIcon).toBeTruthy();
      expect(chevronIcon).toBeTruthy();

      expect(settingsIcon.props.name).toBe('settings-outline');
      expect(openSettingsText.props.children).toBe('permissionBox.submissionSettings');
      expect(chevronIcon.props.name).toBe('chevron-forward');
    });
  });
});
