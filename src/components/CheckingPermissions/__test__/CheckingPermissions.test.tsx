import CheckingPermissions from 'components/CheckingPermissions/CheckingPermissions';
import {render} from '@testing-library/react-native';
import {mockBlockedOnePermissions} from 'screens/TreeSubmission/components/CheckPermissions/__test__/mock';

describe('CheckingPermissions component', () => {
  it('CheckingPermissions component should be defined', () => {
    expect(CheckingPermissions).toBeDefined();
    expect(typeof CheckingPermissions).toBe('function');
  });

  describe('CheckingPermissions title and description', () => {
    it('cant proceed', () => {
      let getElementByTestId;
      const element = render(<CheckingPermissions cantProceed={true} permissions={mockBlockedOnePermissions} />);
      getElementByTestId = element.getByTestId;

      const title = getElementByTestId('checkingPermissions-title');
      const beSure = getElementByTestId('checkingPermissions-be-sure');
      const checkingList = getElementByTestId('permissions-list');

      expect(checkingList).toBeTruthy();
      expect(checkingList.props.children.length).toBe(3);

      expect(title.props.children).toBe('checkPermission.wrong');
      expect(beSure).toBeTruthy();
      expect(beSure.props.children).toBe('checkPermission.toBeSure');
    });

    it('can proceed', () => {
      let getElementByTestId, queryElementByTestId;
      const element = render(<CheckingPermissions cantProceed={false} permissions={mockBlockedOnePermissions} />);
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;

      const checkingList = getElementByTestId('permissions-list');
      const title = getElementByTestId('checkingPermissions-title');
      const beSure = queryElementByTestId('checkingPermissions-be-sure');

      expect(checkingList).toBeTruthy();
      expect(checkingList.props.children.length).toBe(3);

      expect(title.props.children).toBe('checkPermission.checkingTitle');
      expect(beSure).toBeFalsy();
    });
  });
});
