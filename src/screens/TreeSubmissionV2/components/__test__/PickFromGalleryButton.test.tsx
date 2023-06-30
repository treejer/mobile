import {render} from '@testing-library/react-native';

import {PickFromGalleryButton} from 'screens/TreeSubmissionV2/components/PickFromGalleryButton/PickFromGalleryButton';
import {stylesToOneObject} from 'utilities/helpers/stylesToOneObject';
import {colors} from 'constants/values';

describe('PickFromGalleryButton component', () => {
  it('PickFromGalleryButton component should be defined', () => {
    expect(PickFromGalleryButton).toBeDefined();
    expect(typeof PickFromGalleryButton).toBe('function');
  });

  describe('PickFromGalleryButton', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(
        <PickFromGalleryButton testID="pick-button-cpt" hasTreePhoto={false} onPress={() => {}} />,
      );
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const pickBtn = getElementByTestId('pick-button-cpt');
      const galleryIcon = getElementByTestId('gallery-button-icon');
      const galleryBtnText = getElementByTestId('gallery-button-text');

      expect(pickBtn).toBeTruthy();
      expect(stylesToOneObject(pickBtn.props.style).backgroundColor).toBe(colors.grayDarker);
      expect(galleryIcon).toBeTruthy();
      expect(galleryIcon.props.name).toBe('photo-video');
      expect(galleryBtnText).toBeTruthy();
      expect(galleryBtnText.props.children).toBe('submitTreeV2.gallery');
    });
  });
  describe('PickFromGalleryButton', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(<PickFromGalleryButton testID="pick-button-cpt" hasTreePhoto={true} onPress={() => {}} />);
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const pickBtn = getElementByTestId('pick-button-cpt');
      const galleryIcon = getElementByTestId('gallery-button-icon');
      const galleryBtnText = getElementByTestId('gallery-button-text');

      expect(pickBtn).toBeTruthy();
      expect(stylesToOneObject(pickBtn.props.style).backgroundColor).toBe(colors.grayDarkerOpacity);
      expect(galleryIcon).toBeTruthy();
      expect(galleryIcon.props.name).toBe('photo-video');
      expect(galleryBtnText).toBeTruthy();
      expect(galleryBtnText.props.children).toBe('submitTreeV2.gallery');
    });
  });
});
