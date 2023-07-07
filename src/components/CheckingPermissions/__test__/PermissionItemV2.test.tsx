import {PermissionItemV2} from 'components/CheckingPermissions/PermissionItemV2';
import {render} from '@testing-library/react-native';
import {stylesToOneObject} from 'utilities/helpers/stylesToOneObject';
import {colors} from 'constants/values';
import {
  mockBlockedAllPermissions,
  mockCheckingAllPermissions,
  mockGrantedAllPermissions,
} from 'screens/TreeSubmissionV2/components/__test__/mock';

describe('PermissionItemV2 component', () => {
  it('PermissionItemV2 component should be defined', () => {
    expect(PermissionItemV2).toBeDefined();
    expect(typeof PermissionItemV2).toBe('function');
  });

  describe('PermissionItemV2, granted', () => {
    const [location] = mockGrantedAllPermissions;

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

      expect(permissionIconContainerStyles.backgroundColor).toBe(colors.green);

      expect(permissionStatus).toBeTruthy();
      expect(permissionStatus.props.children).toBe(location.status);
    });
  });

  describe('PermissionItemV2, blocked', () => {
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

      expect(permissionIconContainerStyles.backgroundColor).toBe(colors.red);

      expect(permissionStatus).toBeTruthy();
      expect(permissionStatus.props.children).toBe(location.status);
    });
  });

  describe('PermissionItemV2, checking', () => {
    const [location] = mockCheckingAllPermissions;

    let getElementByTestId,
      queryElementByTestId,
      permissionBtnContainer,
      permissionName,
      permissionIcon,
      permissionIconContainer,
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
    });

    it('permission detail and mock permission date should be the same', () => {
      expect(permissionBtnContainer).toBeTruthy();
      expect(permissionName.props.children).toBe(location.name);
      expect(permissionIcon.props.name).toBe(location.icon);
      const permissionIconContainerStyles = stylesToOneObject(permissionIconContainer.props.style);

      expect(permissionIconContainerStyles.backgroundColor).toBe(colors.grayLighter);

      expect(permissionStatus).toBeTruthy();
      expect(permissionStatus.props.children).toBe(location.status);
    });
  });
});
