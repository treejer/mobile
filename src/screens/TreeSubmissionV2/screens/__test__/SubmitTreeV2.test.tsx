import {SubmitTreeV2} from 'screens/TreeSubmissionV2/screens/SubmitTreeV2/SubmitTreeV2';
import {render, act, fireEvent, waitFor} from 'ranger-testUtils/testingLibrary';
import {TestSubmissionStack} from 'ranger-testUtils/components/TestSubmissionStack/TestSubmissionStack';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {Routes} from 'navigation/Navigation';
import {
  mockPlantTreePermissionsCameraGranted,
  mockPlantTreePermissionsGranted,
  mockPlantTreePermissionsLocationGranted,
} from 'screens/TreeSubmissionV2/components/__test__/mock';

describe('SubmitTreeV2 component', () => {
  it('SubmitTreeV2 component should be defined', () => {
    expect(SubmitTreeV2).toBeDefined();
    expect(typeof SubmitTreeV2).toBe('function');
  });
  describe('SubmitTreeV2, permissions = all granted', () => {
    let getElementByTestId, queryElementByTestId;

    beforeEach(() => {
      const element = render(
        <TestSubmissionStack
          name={Routes.SubmitTree_V2}
          component={<SubmitTreeV2 plantTreePermissions={mockPlantTreePermissionsGranted} />}
        />,
        goerliReducers,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const permissionBox = getElementByTestId('check-permissions-box');
      const submissionTitle = getElementByTestId('submission-title');
      const selectTreePhoto = getElementByTestId('select-tree-photo-cpt');
      const selectTreeLocation = getElementByTestId('select-tree-location-cpt');
      const draftButton = queryElementByTestId('draft-submission');
      const previewButton = queryElementByTestId('preview-submission');
      const submitButton = queryElementByTestId('submit-submission');

      expect(permissionBox).toBeTruthy();
      expect(submissionTitle).toBeTruthy();
      expect(selectTreePhoto).toBeTruthy();
      expect(selectTreeLocation).toBeTruthy();

      expect(draftButton).toBeFalsy();
      expect(previewButton).toBeFalsy();
      expect(submitButton).toBeFalsy();
    });

    it('after press select-tree-location should navigate', async () => {
      const locationBtn = getElementByTestId('select-location-button');

      await act(() => {
        fireEvent.press(locationBtn);
      });
      await waitFor(() => {
        const mapMarking = getElementByTestId('map-marking-cpt');
        expect(mapMarking).toBeTruthy();
      });
    });
  });
  describe('SubmitTreeV2, permissions = location granted', () => {
    let getElementByTestId, queryElementByTestId;

    beforeEach(() => {
      const element = render(
        <TestSubmissionStack
          name={Routes.SubmitTree_V2}
          component={<SubmitTreeV2 plantTreePermissions={mockPlantTreePermissionsLocationGranted} />}
        />,
        goerliReducers,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const permissionBox = getElementByTestId('check-permissions-box');
      const submissionTitle = getElementByTestId('submission-title');
      const blockedTreePhotoField = getElementByTestId('locked-camera-cpt');
      const selectTreePhoto = queryElementByTestId('select-tree-photo-cpt');
      const selectTreeLocation = getElementByTestId('select-tree-location-cpt');
      const draftButton = queryElementByTestId('draft-submission');
      const previewButton = queryElementByTestId('preview-submission');
      const submitButton = queryElementByTestId('submit-submission');

      expect(permissionBox).toBeTruthy();
      expect(submissionTitle).toBeTruthy();
      expect(blockedTreePhotoField).toBeTruthy();
      expect(selectTreePhoto).toBeFalsy();
      expect(selectTreeLocation).toBeTruthy();

      expect(draftButton).toBeFalsy();
      expect(previewButton).toBeFalsy();
      expect(submitButton).toBeFalsy();
    });
  });

  describe('SubmitTreeV2, permissions = camera granted', () => {
    let getElementByTestId, queryElementByTestId;

    beforeEach(() => {
      const element = render(
        <TestSubmissionStack
          name={Routes.SubmitTree_V2}
          component={<SubmitTreeV2 plantTreePermissions={mockPlantTreePermissionsCameraGranted} />}
        />,
        goerliReducers,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const permissionBox = getElementByTestId('check-permissions-box');
      const submissionTitle = getElementByTestId('submission-title');
      const selectTreePhoto = queryElementByTestId('select-tree-photo-cpt');
      const selectTreeLocation = queryElementByTestId('select-tree-location-cpt');
      const blockedTreeLocationField = getElementByTestId('locked-location-cpt');
      const draftButton = queryElementByTestId('draft-submission');
      const previewButton = queryElementByTestId('preview-submission');
      const submitButton = queryElementByTestId('submit-submission');

      expect(permissionBox).toBeTruthy();
      expect(submissionTitle).toBeTruthy();
      expect(selectTreePhoto).toBeTruthy();
      expect(selectTreeLocation).toBeFalsy();
      expect(blockedTreeLocationField).toBeTruthy();

      expect(draftButton).toBeFalsy();
      expect(previewButton).toBeFalsy();
      expect(submitButton).toBeFalsy();
    });
  });
});
