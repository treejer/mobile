import CheckPermissions from 'screens/TreeSubmission/components/CheckPermissions/CheckPermissions';
import {render} from 'ranger-testUtils/testingLibrary';
import {CheckPermissionsV2} from 'screens/TreeSubmissionV2/components/CheckPermissions/CheckPermissionsV2';
import {maticReducers} from 'components/SubmissionSettings/__test__/mock';
import {
  mockPlantTreePermissionsBlocked,
  mockPlantTreePermissionsChecking,
  mockPlantTreePermissionsGranted,
} from 'screens/TreeSubmissionV2/components/__test__/mock';
import {colors} from 'constants/values';

describe('CheckPermissions component', () => {
  it('CheckPermissions component should exist', () => {
    expect(CheckPermissions).toBeDefined();
    expect(typeof CheckPermissions).toBe('function');
  });

  describe('check permissions = blocked', () => {
    let getElementByTestId, queryElementByTestId;

    beforeEach(async () => {
      const element = render(
        <CheckPermissionsV2
          testID="check-permissions-box"
          onUnLock={() => {}}
          lockSettings={false}
          plantTreePermissions={mockPlantTreePermissionsBlocked}
        />,
        maticReducers,
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

    it('submission settings box should not be defined', () => {
      const settingsCpt = queryElementByTestId('submission-settings-cpt');
      expect(settingsCpt).toBeFalsy();
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
        <CheckPermissionsV2
          testID="check-permissions-box"
          onUnLock={() => {}}
          lockSettings={false}
          plantTreePermissions={mockPlantTreePermissionsGranted}
        />,
        maticReducers,
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

    describe('check permissions = granted', () => {
      let getElementByTestId, queryElementByTestId;

      beforeEach(async () => {
        const element = render(
          <CheckPermissionsV2
            testID="check-permissions-box"
            onUnLock={() => {}}
            lockSettings={true}
            plantTreePermissions={mockPlantTreePermissionsGranted}
          />,
          maticReducers,
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

      it('submission settings elements should be defined', async () => {
        const settingsBox = getElementByTestId('permission-box-plant-settings');
        const openSettingsText = getElementByTestId('permission-box-open-settings-text');
        const toggleSettingsBtn = getElementByTestId('toggle-settings-btn');
        const settingsIcon = getElementByTestId('settings-icon');
        const chevronIcon = getElementByTestId('settings-chevron-icon');
        const settingsCpt = getElementByTestId('submission-settings-cpt');

        expect(settingsBox).toBeTruthy();
        expect(openSettingsText).toBeTruthy();
        expect(settingsIcon).toBeTruthy();
        expect(chevronIcon).toBeTruthy();
        expect(settingsCpt).toBeTruthy();

        expect(toggleSettingsBtn.props.accessibilityState.disabled).toBeFalsy();
        expect(settingsIcon.props.name).toBe('settings-outline');
        expect(openSettingsText.props.children).toBe('permissionBox.submissionSettings');
        expect(chevronIcon.props.name).toBe('lock-closed');
      });
    });

    describe('check permissions = isChecking', () => {
      let getElementByTestId, queryElementByTestId;

      beforeEach(async () => {
        const element = render(
          <CheckPermissionsV2
            testID="check-permissions-box"
            onUnLock={() => {}}
            lockSettings={false}
            plantTreePermissions={mockPlantTreePermissionsChecking}
          />,
          maticReducers,
        );
        getElementByTestId = element.getByTestId;
        queryElementByTestId = element.queryByTestId;
      });

      it('permission box title', () => {
        const permissionBoxTitle = getElementByTestId('permission-box-title');
        const permissionsBoxLoading = getElementByTestId('permission-box-checking-indicator');

        expect(permissionBoxTitle).toBeTruthy();
        expect(permissionBoxTitle.props.children).toBe('permissionBox.isChecking');
        expect(permissionsBoxLoading).toBeTruthy();
        expect(permissionsBoxLoading.props.size).toBe('small');
        expect(permissionsBoxLoading.props.color).toBe(colors.grayDarker);
      });

      it('permissions list length must be 3', () => {
        const permissionsList = queryElementByTestId('permissions-list');

        expect(permissionsList).toBeTruthy();
      });

      it('guide in footer should be invisible', () => {
        const guideText = queryElementByTestId('permission-box-guide');

        expect(guideText).toBeFalsy();
      });

      it('settings box should be invisible', () => {
        const settingsBox = queryElementByTestId('permission-box-plant-settings');
        const settingsCpt = queryElementByTestId('submission-settings-cpt');

        expect(settingsBox).toBeFalsy();
        expect(settingsCpt).toBeFalsy();
      });
    });
  });
});