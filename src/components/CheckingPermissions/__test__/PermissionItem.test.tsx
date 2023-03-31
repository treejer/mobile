import {render} from '@testing-library/react-native';
import {mockBlockedAllPermissions} from 'screens/TreeSubmission/components/CheckPermissions/__test__/mock';
import {OpenSettingsButton} from 'screens/TreeSubmission/components/CheckPermissions/CheckPermissions';
import {PermissionItem} from 'components/CheckingPermissions/PermissionItem';

describe('openSettingsButton component', () => {
  it('OpenSettingsButton should be defined', () => {
    expect(OpenSettingsButton).toBeDefined();
    expect(typeof OpenSettingsButton).toBe('function');
  });

  describe('OpenSettingsButton', () => {
    const mockCaption = 'Mock Caption';

    let getElementByTestId;
    beforeEach(() => {
      const element = render(<OpenSettingsButton caption={mockCaption} onPress={() => {}} />);
      getElementByTestId = element.getByTestId;
    });

    it('caption Text value should be like the caption prop value', () => {
      const captionText = getElementByTestId('caption-text');
      expect(captionText.props.children).toBe(mockCaption);
    });
  });
});

describe('PermissionItem component', () => {
  it('PermissionItem component should be defined', () => {
    expect(PermissionItem).toBeDefined();
    expect(typeof PermissionItem).toBe('function');
  });

  describe('PermissionItem col = true', () => {
    const [location] = mockBlockedAllPermissions;

    const col = true;

    let getElementByTestId,
      queryElementByTestId,
      permissionBtnContainer,
      permissionName,
      permissionIcon,
      permissionIconContainer,
      openSettingBtn,
      permissionStatus;
    beforeEach(() => {
      const element = render(<PermissionItem permission={location} col={col} />);
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
      permissionBtnContainer = getElementByTestId('permission-btn-container');
      permissionIconContainer = getElementByTestId('permission-icon-container');
      permissionIcon = getElementByTestId('permission-icon');
      permissionName = getElementByTestId('permission-name');
      permissionStatus = queryElementByTestId('permission-status');
      openSettingBtn = queryElementByTestId('open-setting-btn');
    });

    it('permission detail and mock permission date should be the same', () => {
      expect(permissionBtnContainer).toBeTruthy();
      expect(permissionName.props.children).toBe(location.name);
      expect(permissionIcon.props.name).toBe(location.icon);

      expect(permissionStatus).toBeFalsy();
      expect(permissionStatus).toBeNull();
      if (!location.isGranted) {
        expect(openSettingBtn).toBeFalsy();
      }
    });
  });

  describe('PermissionItem col = false', () => {
    const [location] = mockBlockedAllPermissions;

    const col = true;

    let getElementByTestId,
      queryElementByTestId,
      permissionBtnContainer,
      permissionName,
      permissionIcon,
      permissionIconContainer,
      openSettingBtn,
      permissionStatus;
    beforeEach(() => {
      const element = render(<PermissionItem permission={location} col={col} />);
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
      permissionBtnContainer = getElementByTestId('permission-btn-container');
      permissionIconContainer = getElementByTestId('permission-icon-container');
      permissionIcon = getElementByTestId('permission-icon');
      permissionName = getElementByTestId('permission-name');
      permissionStatus = queryElementByTestId('permission-status');
      openSettingBtn = queryElementByTestId('open-setting-btn');
    });

    it('permission detail and mock permission date should be the same', () => {
      expect(permissionBtnContainer).toBeTruthy();
      expect(permissionName.props.children).toBe(location.name);
      expect(permissionIcon.props.name).toBe(location.icon);

      expect(permissionStatus).toBeFalsy();
      if (location.isGranted) {
        expect(openSettingBtn).toBeFalsy();
      }
    });
  });
});
