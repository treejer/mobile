import {SelectTreePhoto} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreePhoto';
import {act, fireEvent, render, waitFor} from '@testing-library/react-native';
import {onBoardingTwo} from '../../../../../assets/images';

jest.mock('../../../../utilities/helpers/web', () => {
  return {
    isWeb: () => true,
  };
});

describe('SelectTreePhoto component (web functionalities)', () => {
  it('SelectTreePhoto should be defined', () => {
    expect(SelectTreePhoto).toBeDefined();
    expect(typeof SelectTreePhoto).toBe('function');
  });
  describe('SelectTreePhoto web', () => {
    let getElementByTestId, queryElementByTestId;

    beforeEach(() => {
      const element = render(
        <SelectTreePhoto testID="select-tree-photo-cpt" onSelect={() => {}} onRemove={() => {}} />,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('WebCam modal should be visible', async () => {
      const webCamModal = getElementByTestId('web-cam-modal');
      const cameraBtn = getElementByTestId('camera-button');
      expect(webCamModal).toBeTruthy();
      expect(webCamModal.props.visible).toBeFalsy();
      expect(cameraBtn).toBeTruthy();

      await act(() => {
        fireEvent.press(cameraBtn);
      });
      await waitFor(() => {
        const webCamModal = getElementByTestId('web-cam-modal');
        expect(webCamModal).toBeTruthy();
        expect(webCamModal.props.visible).toBeTruthy();
      });
    });
    it('WebImagePickerCropper modal should be visible', async () => {
      const webImagePickerCropperModal = getElementByTestId('web-image-picker-cropper-modal');
      const galleryBtn = getElementByTestId('gallery-button');
      expect(webImagePickerCropperModal).toBeTruthy();
      expect(webImagePickerCropperModal.props.visible).toBeFalsy();
      expect(galleryBtn).toBeTruthy();

      await act(() => {
        fireEvent.press(galleryBtn, {target: {files: [onBoardingTwo]}});
      });
      await waitFor(() => {
        const webImagePickerCropperModal = getElementByTestId('web-image-picker-cropper-modal');
        expect(webImagePickerCropperModal).toBeTruthy();
        expect(webImagePickerCropperModal.props.visible).toBeTruthy();
      });
    });
  });
});
