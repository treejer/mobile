import {render} from 'ranger-testUtils/testingLibrary';
import {mapboxPrivateToken} from 'services/config';
import {PreviewTreeDetails} from 'screens/TreeSubmissionV2/components/PreviewTreeDetails/PreviewTreeDetails';
import {
  singleTreeReducer,
  updateLoadingReducer,
  updateTreeReducer,
} from 'screens/TreeSubmissionV2/components/__test__/PreviewTreeDetails.mock';
import {shortenedString} from 'utilities/helpers/shortenedString';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';
import {Hex2Dec} from 'utilities/helpers/hex';

describe('PreviewTreeDetails component', () => {
  it('PreviewTreeDetails component should be defined', () => {
    expect(PreviewTreeDetails).toBeDefined();
    expect(typeof PreviewTreeDetails).toBe('function');
  });

  describe('PreviewTreeDetails, plant regular', () => {
    let getElementByTestId, queryElementByTestId;
    beforeEach(() => {
      const element = render(
        <PreviewTreeDetails
          isVisible={true}
          currentJourney={singleTreeReducer.currentJourney}
          onClose={() => {}}
          onSubmit={() => {}}
          onDraft={() => {}}
        />,
        singleTreeReducer,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('elements/components should be defined', () => {
      const gesture = getElementByTestId('modal-gesture');
      const treeName = getElementByTestId('tree-name');
      const treeImage = getElementByTestId('tree-image-cpt');
      const treeCoordsLabel = getElementByTestId('tree-coords-label');
      const treeCoords = getElementByTestId('tree-coords');
      const treeSubmittedAtLabel = getElementByTestId('tree-submittedAt-date-label');
      const treeSubmittedAt = getElementByTestId('tree-submittedAt-date');
      const treeSignatureLabel = getElementByTestId('tree-signature-label');
      const treeSignature = getElementByTestId('tree-signature');
      const treeLocationBtn = getElementByTestId('tree-location-btn');
      const treeLocation = getElementByTestId('tree-location-image');
      const treePhotos = getElementByTestId('tree-photos-slider');
      const submitBtn = getElementByTestId('submit-btn');
      const submitBtnText = getElementByTestId('submit-btn-text');
      const draftBtn = getElementByTestId('draft-btn');
      const draftBtnText = getElementByTestId('draft-btn-text');
      const rejectBtn = getElementByTestId('reject-btn');
      const rejectBtnText = getElementByTestId('reject-btn-text');

      const treeIdLabel = queryElementByTestId('tree-id-label');
      const treeId = queryElementByTestId('tree-id');

      const staticMapUrl = getStaticMapboxUrl(
        mapboxPrivateToken,
        singleTreeReducer.currentJourney?.location?.longitude,
        singleTreeReducer.currentJourney?.location?.latitude,
        600,
        300,
      );

      expect(gesture).toBeTruthy();

      expect(treeName).toBeTruthy();
      expect(treeName.props.children).toBe(2);

      expect(treeImage).toBeTruthy();

      expect(treeIdLabel).toBeFalsy();
      expect(treeId).toBeFalsy();

      expect(treeCoordsLabel).toBeTruthy();
      expect(treeCoordsLabel.props.children).toBe('previewTreeDetails.gpsCoords');

      expect(treeCoords.props.children).toBe('previewTreeDetails.coords');

      expect(treeSubmittedAtLabel).toBeTruthy();
      expect(treeSubmittedAtLabel.props.children).toBe('previewTreeDetails.submitDate');

      expect(treeSubmittedAt).toBeTruthy();
      expect(treeSubmittedAt.props.children).toBe(new Date().toLocaleDateString());

      expect(treeSignatureLabel).toBeTruthy();
      expect(treeSignatureLabel.props.children).toBe('previewTreeDetails.signature');

      expect(treeSignature).toBeTruthy();
      expect(treeSignature.props.children).toBe(shortenedString('0000000000000000', 16, 4));

      expect(treeLocationBtn).toBeTruthy();
      expect(treeLocation).toBeTruthy();
      expect(treeLocation.props.source).toEqual({uri: staticMapUrl});

      expect(treePhotos).toBeTruthy();

      expect(submitBtn).toBeTruthy();
      expect(submitBtnText).toBeTruthy();
      expect(submitBtnText.props.children).toBe('previewTreeDetails.submit');
      expect(draftBtn).toBeTruthy();
      expect(draftBtnText).toBeTruthy();
      expect(draftBtnText.props.children).toBe('previewTreeDetails.draft');
      expect(rejectBtn).toBeTruthy();
      expect(rejectBtnText).toBeTruthy();
      expect(rejectBtnText.props.children).toBe('previewTreeDetails.reject');
    });
  });
  describe('PreviewTreeDetails, update', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(
        <PreviewTreeDetails
          isVisible={true}
          currentJourney={updateTreeReducer.currentJourney}
          onClose={() => {}}
          onSubmit={() => {}}
          onDraft={() => {}}
        />,
        updateTreeReducer,
      );
      getElementByTestId = element.getByTestId;
    });

    it('elements/components should be defined', () => {
      const gesture = getElementByTestId('modal-gesture');
      const treeName = getElementByTestId('tree-name');
      const treeImage = getElementByTestId('tree-image-cpt');
      const treeIdLabel = getElementByTestId('tree-id-label');
      const treeId = getElementByTestId('tree-id');
      const treeCoordsLabel = getElementByTestId('tree-coords-label');
      const treeCoords = getElementByTestId('tree-coords');
      const treeSubmittedAtLabel = getElementByTestId('tree-submittedAt-date-label');
      const treeSubmittedAt = getElementByTestId('tree-submittedAt-date');
      const treeSignatureLabel = getElementByTestId('tree-signature-label');
      const treeSignature = getElementByTestId('tree-signature');
      const treeLocationBtn = getElementByTestId('tree-location-btn');
      const treeLocation = getElementByTestId('tree-location-image');
      const treePhotos = getElementByTestId('tree-photos-slider');
      const submitBtn = getElementByTestId('submit-btn');
      const submitBtnText = getElementByTestId('submit-btn-text');
      const draftBtn = getElementByTestId('draft-btn');
      const draftBtnText = getElementByTestId('draft-btn-text');
      const rejectBtn = getElementByTestId('reject-btn');
      const rejectBtnText = getElementByTestId('reject-btn-text');

      const staticMapUrl = getStaticMapboxUrl(
        mapboxPrivateToken,
        singleTreeReducer.currentJourney?.location?.longitude,
        singleTreeReducer.currentJourney?.location?.latitude,
        600,
        300,
      );

      expect(gesture).toBeTruthy();

      expect(treeName).toBeTruthy();
      expect(treeName.props.children).toBe(2);

      expect(treeImage).toBeTruthy();

      expect(treeIdLabel).toBeTruthy();
      expect(treeIdLabel.props.children).toBe('previewTreeDetails.treeId');

      expect(treeId).toBeTruthy();
      expect(treeId.props.children).toEqual(['#', Hex2Dec(updateTreeReducer.treeDetails.data.id)]);

      expect(treeCoordsLabel).toBeTruthy();
      expect(treeCoordsLabel.props.children).toBe('previewTreeDetails.gpsCoords');

      expect(treeCoords.props.children).toBe('previewTreeDetails.coords');

      expect(treeSubmittedAtLabel).toBeTruthy();
      expect(treeSubmittedAtLabel.props.children).toBe('previewTreeDetails.submitDate');

      expect(treeSubmittedAt).toBeTruthy();
      expect(treeSubmittedAt.props.children).toBe(new Date().toLocaleDateString());

      expect(treeSignatureLabel).toBeTruthy();
      expect(treeSignatureLabel.props.children).toBe('previewTreeDetails.signature');

      expect(treeSignature).toBeTruthy();
      expect(treeSignature.props.children).toBe(shortenedString('0000000000000000', 16, 4));

      expect(treeLocationBtn).toBeTruthy();
      expect(treeLocation).toBeTruthy();
      expect(treeLocation.props.source).toEqual({uri: staticMapUrl});

      expect(treePhotos).toBeTruthy();
      expect(submitBtn).toBeTruthy();
      expect(submitBtnText).toBeTruthy();
      expect(submitBtnText.props.children).toBe('previewTreeDetails.submit');
      expect(draftBtn).toBeTruthy();
      expect(draftBtnText).toBeTruthy();
      expect(draftBtnText.props.children).toBe('previewTreeDetails.draft');
      expect(rejectBtn).toBeTruthy();
      expect(rejectBtnText).toBeTruthy();
      expect(rejectBtnText.props.children).toBe('previewTreeDetails.reject');
    });
  });

  describe('PreviewTreeDetails loading', () => {
    let getElementByTestId, queryElementByTestId;
    beforeEach(() => {
      const element = render(
        <PreviewTreeDetails
          isVisible={true}
          currentJourney={updateLoadingReducer.currentJourney}
          onClose={() => {}}
          onSubmit={() => {}}
          onDraft={() => {}}
        />,
        updateLoadingReducer,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('elements/components should be defined', () => {
      const loading = getElementByTestId('loading');

      const gesture = queryElementByTestId('modal-gesture');
      const treeName = queryElementByTestId('tree-name');
      const treeImage = queryElementByTestId('tree-image-cpt');
      const treeIdLabel = queryElementByTestId('tree-id-label');
      const treeId = queryElementByTestId('tree-id');
      const treeCoordsLabel = queryElementByTestId('tree-coords-label');
      const treeCoords = queryElementByTestId('tree-coords');
      const treeSubmittedAtLabel = queryElementByTestId('tree-submittedAt-date-label');
      const treeSubmittedAt = queryElementByTestId('tree-submittedAt-date');
      const treeSignatureLabel = queryElementByTestId('tree-signature-label');
      const treeSignature = queryElementByTestId('tree-signature');
      const treeLocationBtn = queryElementByTestId('tree-location-btn');
      const treeLocation = queryElementByTestId('tree-location-image');
      const treePhotos = queryElementByTestId('tree-photos-slider');
      const submitBtn = queryElementByTestId('submit-btn');
      const submitBtnText = queryElementByTestId('submit-btn-text');
      const draftBtn = queryElementByTestId('draft-btn');
      const draftBtnText = queryElementByTestId('draft-btn-text');
      const rejectBtn = queryElementByTestId('reject-btn');
      const rejectBtnText = queryElementByTestId('reject-btn-text');

      expect(loading).toBeTruthy();

      expect(gesture).toBeTruthy();

      expect(treeName).toBeFalsy();

      expect(treeImage).toBeFalsy();

      expect(treeIdLabel).toBeFalsy();

      expect(treeId).toBeFalsy();

      expect(treeCoordsLabel).toBeFalsy();
      expect(treeCoords).toBeFalsy();

      expect(treeSubmittedAtLabel).toBeFalsy();

      expect(treeSubmittedAt).toBeFalsy();

      expect(treeSignatureLabel).toBeFalsy();

      expect(treeSignature).toBeFalsy();

      expect(treeLocationBtn).toBeFalsy();
      expect(treeLocation).toBeFalsy();

      expect(treePhotos).toBeFalsy();
      expect(submitBtn).toBeFalsy();
      expect(submitBtnText).toBeFalsy();
      expect(draftBtn).toBeFalsy();
      expect(draftBtnText).toBeFalsy();
      expect(rejectBtn).toBeFalsy();
      expect(rejectBtnText).toBeFalsy();
    });
  });
});
