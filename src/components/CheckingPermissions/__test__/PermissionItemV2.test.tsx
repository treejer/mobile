import {PermissionItemV2} from 'components/CheckingPermissions/PermissionItemV2';
import {render} from '@testing-library/react-native';
import {mockBlockedAllPermissions} from 'screens/TreeSubmission/components/CheckPermissions/__test__/mock';
import {stylesToOneObject} from 'utilities/helpers/stylesToOneObject';
import {colors} from 'constants/values';

describe('PermissionItemV2 component', () => {
  it('PermissionItemV2 component should be defined', () => {
    expect(PermissionItemV2).toBeDefined();
    expect(typeof PermissionItemV2).toBe('function');
  });

  describe('PermissionItemV2', () => {
    const [location] = mockBlockedAllPermissions;

    let getElementByTestId,
      queryElementByTestId,
      permissionBtnContainer,
      permissionName,
      permissionIcon,
      permissionIconContainer,
      openSettingBtn,
      permissionStatus;
    beforeEach(() => {
      const element = render(<PermissionItemV2 permission={location} />);
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
      const permissionIconContainerStyles = stylesToOneObject(permissionIconContainer.props.style);

      expect(permissionIconContainerStyles.backgroundColor).toBe(
        !location.isExist ? colors.gray : location.isGranted ? colors.green : colors.red,
      );

      expect(permissionStatus).toBeTruthy();
      expect(permissionStatus.props.children).toBe(location.status);
      if (location.isGranted) {
        expect(openSettingBtn).toBeFalsy();
      } else {
        expect(openSettingBtn).toBeTruthy();
      }
    });
  });
});
