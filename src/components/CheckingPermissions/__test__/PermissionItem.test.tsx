import {PermissionItem} from 'components/CheckingPermissions/PermissionItem';
import {render} from '@testing-library/react-native';
import {mockBlockedAllPermissions} from 'screens/TreeSubmission/components/CheckPermissions/__test__/mock';
import {OpenSettingsButton} from 'screens/TreeSubmission/components/CheckPermissions/CheckPermissions';

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
      const captionText = getElementByTestId('open-setting-btn-text');
      expect(captionText.props.children).toBe(mockCaption);
    });
  });
});

describe('PermissionItem component', () => {
  it('PermissionItem component should be defined', () => {
    expect(PermissionItem).toBeDefined();
    expect(typeof PermissionItem).toBe('function');
  });

  describe('PermissionItem', () => {
    const [location] = mockBlockedAllPermissions;

    const col = false;

    let getElementByTestId,
      queryElementByTestId,
      permissionBtnContainer,
      permissionName,
      permissionIcon,
      openSettingBtn,
      permissionStatus;
    beforeEach(() => {
      const element = render(<PermissionItem permission={location} col={col} />);
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
      permissionBtnContainer = getElementByTestId('permission-btn-container');
      permissionIcon = getElementByTestId('permission-icon');
      permissionName = getElementByTestId('permission-name');
      permissionStatus = queryElementByTestId('permission-status');
      openSettingBtn = queryElementByTestId('open-setting-btn');
    });

    it('permission detail and mock permission date should be the same', () => {
      expect(permissionBtnContainer).toBeTruthy();
      expect(permissionName.props.children).toBe(location.name);
      expect(permissionIcon.props.name).toBe(location.icon);
      if (col) {
        expect(permissionStatus).toBeFalsy();
        expect(permissionStatus).toBeNull();
      } else {
        expect(permissionStatus).toBeTruthy();
        expect(permissionStatus.props.children).toBe(location.status);
      }
      if (location.isGranted) {
        expect(openSettingBtn.props).toBeFalsy();
      } else {
        expect(openSettingBtn).toBeTruthy();
      }
    });
  });
});
