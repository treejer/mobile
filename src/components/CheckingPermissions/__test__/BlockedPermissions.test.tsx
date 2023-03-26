import BlockedPermissions from 'components/CheckingPermissions/BlockedPermissions';
import {render} from '@testing-library/react-native';
import {
  mockBlockedAllPermissions,
  mockBlockedOnePermissions,
  mockBlockedTwoPermissions,
  mockGrantedAllPermissions,
} from 'screens/TreeSubmission/components/CheckPermissions/__test__/mock';

describe('BlockedPermissions component', () => {
  it('BlockedPermissions component should be exist', () => {
    expect(BlockedPermissions).toBeDefined();
    expect(typeof BlockedPermissions).toBe('function');
  });

  describe('BlockedPermissions title and description', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(<BlockedPermissions permissions={mockBlockedAllPermissions} />);
      getElementByTestId = element.getByTestId;
    });

    it('BlockedPermissions title and description', () => {
      const title = getElementByTestId('cantProceed-title');
      const desc = getElementByTestId('cantProceed-desc');

      expect(title.props.children).toBe('checkPermission.cantProceed');
      expect(desc.props.children).toBe('checkPermission.cantProceedDesc');
    });
  });

  describe('BlockedPermissions => three blocked', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(<BlockedPermissions permissions={mockBlockedAllPermissions} />);
      getElementByTestId = element.getByTestId;
    });

    it('blocked permissions length should be = 3 and granted permissions length should be = 0', () => {
      const blockedPermissionItems = getElementByTestId('blocked-permission-items');
      const grantedPermissionItems = getElementByTestId('granted-permission-items');
      expect(blockedPermissionItems.props.children.length).toBe(3);
      expect(grantedPermissionItems.props.children.length).toBe(0);
    });
  });

  describe('BlockedPermissions => one blocked', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(<BlockedPermissions permissions={mockBlockedOnePermissions} />);
      getElementByTestId = element.getByTestId;
    });

    it('blocked permissions length should be = 1 and granted permissions length should be = 2', () => {
      const blockedPermissionItems = getElementByTestId('blocked-permission-items');
      const grantedPermissionItems = getElementByTestId('granted-permission-items');
      expect(blockedPermissionItems.props.children.length).toBe(1);
      expect(grantedPermissionItems.props.children.length).toBe(2);
    });
  });

  describe('BlockedPermissions => two blocked', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(<BlockedPermissions permissions={mockBlockedTwoPermissions} />);
      getElementByTestId = element.getByTestId;
    });

    it('blocked permissions length should be = 2 and granted permissions length should be = 1', () => {
      const blockedPermissionItems = getElementByTestId('blocked-permission-items');
      const grantedPermissionItems = getElementByTestId('granted-permission-items');
      expect(blockedPermissionItems.props.children.length).toBe(2);
      expect(grantedPermissionItems.props.children.length).toBe(1);
    });
  });

  describe('BlockedPermissions => granted all', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(<BlockedPermissions permissions={mockGrantedAllPermissions} />);
      getElementByTestId = element.getByTestId;
    });

    it('blocked permissions length should be = 0 and granted permissions length should be = 3', () => {
      const blockedPermissionItems = getElementByTestId('blocked-permission-items');
      const grantedPermissionItems = getElementByTestId('granted-permission-items');
      expect(blockedPermissionItems.props.children.length).toBe(0);
      expect(grantedPermissionItems.props.children.length).toBe(3);
    });
  });
});
