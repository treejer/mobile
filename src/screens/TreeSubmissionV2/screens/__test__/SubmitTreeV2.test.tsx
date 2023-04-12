import {SubmitTreeV2} from 'screens/TreeSubmissionV2/screens/SubmitTreeV2/SubmitTreeV2';
import {render, act, fireEvent, waitFor} from 'ranger-testUtils/testingLibrary';
import {TestSubmissionStack} from 'ranger-testUtils/components/TestSubmissionStack/TestSubmissionStack';
import {DraftType} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {Routes} from 'navigation/Navigation';
import {
  mockPlantTreePermissionsCameraGranted,
  mockPlantTreePermissionsGranted,
  mockPlantTreePermissionsLocationGranted,
} from 'screens/TreeSubmissionV2/components/__test__/mock';
import {onBoardingOne} from '../../../../../assets/images';

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
      const submissionButtons = queryElementByTestId('submission-buttons');

      expect(permissionBox).toBeTruthy();
      expect(submissionTitle).toBeTruthy();
      expect(selectTreePhoto).toBeTruthy();
      expect(selectTreeLocation).toBeTruthy();

      expect(submissionButtons).toBeFalsy();
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
      const submissionButtons = queryElementByTestId('submission-buttons');

      expect(permissionBox).toBeTruthy();
      expect(submissionTitle).toBeTruthy();
      expect(blockedTreePhotoField).toBeTruthy();
      expect(selectTreePhoto).toBeFalsy();
      expect(selectTreeLocation).toBeTruthy();

      expect(submissionButtons).toBeTruthy();
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
        {
          ...goerliReducers,
          currentJourney: {
            isSingle: true,
            location: {
              latitude: 20000,
              longitude: 2000,
            },
          },
        },
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
      const submissionButton = queryElementByTestId('submission-buttons');

      expect(permissionBox).toBeTruthy();
      expect(submissionTitle).toBeTruthy();
      expect(selectTreePhoto).toBeTruthy();
      expect(selectTreeLocation).toBeFalsy();
      expect(blockedTreeLocationField).toBeTruthy();

      expect(submissionButton).toBeTruthy();
    });
  });
  describe('SubmitTreeV2, permissions draft', () => {
    let getElementByTestId, queryElementByTestId;

    beforeEach(() => {
      const element = render(
        <TestSubmissionStack
          name={Routes.SubmitTree_V2}
          component={<SubmitTreeV2 plantTreePermissions={mockPlantTreePermissionsGranted} />}
        />,
        {
          ...goerliReducers,
          currentJourney: {
            isSingle: true,
            location: {
              latitude: 20000,
              longitude: 2000,
            },
          },
        },
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', async () => {
      const permissionBox = getElementByTestId('check-permissions-box');
      const submissionTitle = getElementByTestId('submission-title');
      const selectTreePhoto = getElementByTestId('select-tree-photo-cpt');
      const selectTreeLocation = getElementByTestId('select-tree-location-cpt');
      const blockedTreeLocationField = queryElementByTestId('locked-location-cpt');
      const submissionButton = queryElementByTestId('submission-buttons');
      const draftButton = getElementByTestId('draft-submission');
      const draftModal = queryElementByTestId('draft-modal');

      expect(draftModal).toBeFalsy();
      expect(permissionBox).toBeTruthy();
      expect(submissionTitle).toBeTruthy();
      expect(selectTreePhoto).toBeTruthy();
      expect(selectTreeLocation).toBeTruthy();
      expect(blockedTreeLocationField).toBeFalsy();

      expect(submissionButton).toBeTruthy();
      expect(draftButton).toBeTruthy();

      await act(async () => {
        await fireEvent.press(draftButton, DraftType.Draft);
      });
      await waitFor(() => {
        const draftModal = getElementByTestId('draft-modal');
        expect(draftModal).toBeTruthy();
      });
    });
  });
  describe('SubmitTreeV2, permissions submit offline', () => {
    let getElementByTestId, queryElementByTestId;

    beforeEach(() => {
      const element = render(
        <TestSubmissionStack
          name={Routes.SubmitTree_V2}
          component={<SubmitTreeV2 plantTreePermissions={mockPlantTreePermissionsGranted} />}
        />,
        {
          ...goerliReducers,
          netInfo: {
            isConnected: false,
          },
          currentJourney: {
            isSingle: true,
            photo: onBoardingOne,
            photoLocation: {
              latitude: 20000,
              longitude: 2000,
            },
            location: {
              latitude: 20000,
              longitude: 2000,
            },
          },
        },
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', async () => {
      const permissionBox = getElementByTestId('check-permissions-box');
      const submissionTitle = getElementByTestId('submission-title');
      const selectTreePhoto = getElementByTestId('select-tree-photo-cpt');
      const selectTreeLocation = getElementByTestId('select-tree-location-cpt');
      const blockedTreeLocationField = queryElementByTestId('locked-location-cpt');
      const submissionButton = queryElementByTestId('submission-buttons');
      const submitButton = getElementByTestId('submit-submission');
      const draftModal = queryElementByTestId('draft-modal');

      expect(draftModal).toBeFalsy();
      expect(permissionBox).toBeTruthy();
      expect(submissionTitle).toBeTruthy();
      expect(selectTreePhoto).toBeTruthy();
      expect(selectTreeLocation).toBeTruthy();
      expect(blockedTreeLocationField).toBeFalsy();

      expect(submissionButton).toBeTruthy();
      expect(submitButton).toBeTruthy();

      await act(async () => {
        await fireEvent.press(submitButton);
      });
      await waitFor(() => {
        const draftModal = getElementByTestId('draft-modal');
        expect(draftModal).toBeTruthy();
      });

      await act(async () => {
        const cancelDraftBtn = getElementByTestId('cancel-btn');
        await fireEvent.press(cancelDraftBtn);
      });
      await waitFor(() => {
        const draftModal = queryElementByTestId('draft-modal');
        expect(draftModal).toBeFalsy();
      });

      await act(async () => {
        await fireEvent.press(submitButton);
      });
      await waitFor(() => {
        const draftModal = getElementByTestId('draft-modal');
        expect(draftModal).toBeTruthy();
      });

      await act(async () => {
        const submitDraftBtn = getElementByTestId('submit-btn');
        await fireEvent.press(submitDraftBtn);
      });
      await waitFor(() => {
        const draftModal = queryElementByTestId('draft-modal');
        expect(draftModal).toBeFalsy();
      });
    });
  });
});
