import {render} from 'ranger-testUtils/testingLibrary';
import {SubmissionButtons} from 'screens/TreeSubmissionV2/components/SubmissionButtons/SubmissionButtons';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';

describe('SubmissionButtons component', () => {
  it('SubmissionButtons component should be defined', () => {
    expect(SubmissionButtons).toBeDefined();
    expect(typeof SubmissionButtons).toBe('function');
  });

  it('permission button', () => {
    let getElementByTestId, queryElementByTestId;
    const element = render(
      <SubmissionButtons
        hasNoPermission={true}
        canDraft={false}
        canSubmit={false}
        isSingle={true}
        onGrant={() => {}}
        onSubmit={() => {}}
        onDraft={() => {}}
        onReview={() => {}}
      />,
      {
        ...goerliReducers,
        netInfo: {
          isConnected: true,
        },
      },
    );
    getElementByTestId = element.getByTestId;
    queryElementByTestId = element.queryByTestId;

    const permissionButton = getElementByTestId('permission-btn');
    const permissionButtonText = getElementByTestId('permission-btn-text');
    const draftButton = queryElementByTestId('draft-submission');
    const submitButton = queryElementByTestId('submit-submission');
    const previewButton = queryElementByTestId('preview-submission');
    expect(permissionButton).toBeTruthy();
    expect(permissionButtonText).toBeTruthy();
    expect(permissionButtonText.props.children).toBe('submitTreeV2.buttons.grantAll');
    expect(draftButton).toBeFalsy();
    expect(submitButton).toBeFalsy();
    expect(previewButton).toBeFalsy();
  });

  it('just draft', () => {
    let getElementByTestId, queryElementByTestId;
    const element = render(
      <SubmissionButtons
        canDraft={true}
        canSubmit={false}
        isSingle={true}
        onSubmit={() => {}}
        onDraft={() => {}}
        onReview={() => {}}
      />,
      {
        ...goerliReducers,
        netInfo: {
          isConnected: true,
        },
      },
    );
    getElementByTestId = element.getByTestId;
    queryElementByTestId = element.queryByTestId;

    const permissionButton = queryElementByTestId('permission-btn');
    const draftButton = getElementByTestId('draft-submission');
    const submitButton = queryElementByTestId('submit-submission');
    const previewButton = queryElementByTestId('preview-submission');
    expect(permissionButton).toBeFalsy();
    expect(draftButton).toBeTruthy();
    expect(submitButton).toBeFalsy();
    expect(previewButton).toBeFalsy();

    const draftButtonText = getElementByTestId('draft-submission-text');
    expect(draftButtonText.props.children).toBe('submitTreeV2.buttons.draftSingle');
  });
  it('can submit', () => {
    let getElementByTestId, queryElementByTestId;
    const element = render(
      <SubmissionButtons
        canDraft={true}
        canSubmit={true}
        isSingle={false}
        onSubmit={() => {}}
        onDraft={() => {}}
        onReview={() => {}}
      />,
      {
        ...goerliReducers,
        netInfo: {
          isConnected: true,
        },
      },
    );

    getElementByTestId = element.getByTestId;
    queryElementByTestId = element.queryByTestId;

    const permissionButton = queryElementByTestId('permission-btn');
    const draftButton = getElementByTestId('draft-submission');
    const submitButton = getElementByTestId('submit-submission');
    const previewButton = getElementByTestId('preview-submission');
    expect(permissionButton).toBeFalsy();
    expect(draftButton).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(previewButton).toBeTruthy();

    const draftButtonText = getElementByTestId('draft-submission-text');
    const submitButtonText = getElementByTestId('submit-submission-text');
    const previewButtonText = getElementByTestId('preview-submission-text');
    expect(draftButtonText).toBeTruthy();
    expect(submitButtonText).toBeTruthy();
    expect(draftButtonText).toBeTruthy();
    expect(draftButtonText.props.children).toBe('submitTreeV2.buttons.draftNursery');
    expect(submitButtonText.props.children).toBe('submitTreeV2.buttons.plantNursery');
    expect(previewButtonText.props.children).toBe('submitTreeV2.buttons.previewNursery');
  });

  it('internet disconnected', () => {
    let getElementByTestId;
    const element = render(
      <SubmissionButtons
        canDraft={true}
        canSubmit={true}
        isSingle={true}
        isUpdate={true}
        onSubmit={() => {}}
        onDraft={() => {}}
        onReview={() => {}}
      />,
      {
        ...goerliReducers,
        netInfo: {
          isConnected: false,
        },
      },
    );

    getElementByTestId = element.getByTestId;

    const draftButton = getElementByTestId('draft-submission');
    const submitButton = getElementByTestId('submit-submission');
    const previewButton = getElementByTestId('preview-submission');
    expect(draftButton).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(previewButton).toBeTruthy();

    const draftButtonText = getElementByTestId('draft-submission-text');
    const submitButtonText = getElementByTestId('submit-submission-text');
    const previewButtonText = getElementByTestId('preview-submission-text');
    const submitOfflineText = getElementByTestId('submit-offline-text');
    expect(submitOfflineText).toBeTruthy();
    expect(submitOfflineText.props.children).toBe('submitTreeV2.buttons.offline');

    expect(draftButtonText).toBeTruthy();
    expect(submitButtonText).toBeTruthy();
    expect(draftButtonText).toBeTruthy();
    expect(draftButtonText.props.children).toBe('submitTreeV2.buttons.draftSingle');
    expect(submitButtonText.props.children).toBe('submitTreeV2.buttons.updateSingle');
    expect(previewButtonText.props.children).toBe('submitTreeV2.buttons.previewSingle');
  });
});
