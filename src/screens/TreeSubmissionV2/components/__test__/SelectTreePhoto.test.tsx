import {render} from '@testing-library/react-native';

import {onBoardingTwo} from '../../../../../assets/images';
import {SelectTreePhoto} from 'screens/TreeSubmissionV2/components/SubmissionFields/SelectTreePhoto';
import {stylesToOneObject} from 'utilities/helpers/stylesToOneObject';
import {colors} from 'constants/values';

describe('SelectTreePhoto component', () => {
  it('SelectTreePhoto component should be defined', () => {
    expect(SelectTreePhoto).toBeDefined();
    expect(typeof SelectTreePhoto).toBe('function');
  });

  describe('SelectTreePhoto not selected & empty', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(<SelectTreePhoto testID="select-tree-photo-cpt" onSelect={() => {}} />);
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const container = getElementByTestId('select-tree-photo-cpt');
      const contentContainer = getElementByTestId('select-tree-photo-content');
      const textsContainer = getElementByTestId('select-tree-photo-text-container');
      const photoTitle = getElementByTestId('photo-title');
      const photoDescription = getElementByTestId('photo-description');
      const cameraBtn = getElementByTestId('camera-button');
      const cameraBtnText = getElementByTestId('camera-button-text');
      const cameraIcon = getElementByTestId('camera-button-icon');

      const galleryBtn = getElementByTestId('gallery-button');
      const galleryBtnText = getElementByTestId('gallery-button-text');
      const galleryIcon = getElementByTestId('gallery-button-icon');

      expect(container).toBeTruthy();
      expect(stylesToOneObject(container.props.style).height).toBe(104);

      expect(contentContainer).toBeTruthy();
      expect(stylesToOneObject(contentContainer.props.style).backgroundColor).toBe(colors.khaki);

      expect(textsContainer).toBeTruthy();
      expect(stylesToOneObject(textsContainer.props.style).height).toBe(74);
      expect(stylesToOneObject(textsContainer.props.style).minWidth).toBe(178);
      expect(stylesToOneObject(textsContainer.props.style).backgroundColor).toBe('transparent');

      expect(photoTitle).toBeTruthy();
      expect(photoTitle.props.children).toBe('submitTreeV2.photo');

      expect(photoDescription).toBeTruthy();
      expect(photoDescription.props.i18nKey).toBe('submitTreeV2.selectPhoto');

      expect(cameraBtn).toBeTruthy();
      expect(cameraBtnText).toBeTruthy();
      expect(cameraBtnText.props.children).toBe('submitTreeV2.camera');
      expect(cameraIcon.props.name).toBe('camera');

      expect(galleryBtn).toBeTruthy();
      expect(galleryBtnText).toBeTruthy();
      expect(galleryBtnText.props.children).toBe('submitTreeV2.gallery');
      expect(galleryIcon.props.name).toBe('photo-video');
    });
  });

  describe('SelectTreePhoto with initial value', () => {
    let getElementByTestId;

    const treePhoto = onBoardingTwo;

    beforeEach(() => {
      const element = render(
        <SelectTreePhoto testID="select-tree-photo-cpt" treePhoto={treePhoto} onSelect={() => {}} />,
      );
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const container = getElementByTestId('select-tree-photo-cpt');
      const treeImageBg = getElementByTestId('select-tree-photo-bg');
      const contentContainer = getElementByTestId('select-tree-photo-content');
      const textsContainer = getElementByTestId('select-tree-photo-text-container');
      const photoTitle = getElementByTestId('photo-title');
      const photoDescription = getElementByTestId('photo-description');
      const cameraBtn = getElementByTestId('camera-button');
      const cameraBtnText = getElementByTestId('camera-button-text');
      const cameraIcon = getElementByTestId('camera-button-icon');

      const galleryBtn = getElementByTestId('gallery-button');
      const galleryBtnText = getElementByTestId('gallery-button-text');
      const galleryIcon = getElementByTestId('gallery-button-icon');

      expect(container).toBeTruthy();
      expect(stylesToOneObject(container.props.style).height).toBe(104);

      expect(contentContainer).toBeTruthy();
      expect(stylesToOneObject(contentContainer.props.style).backgroundColor).toBe(colors.darkOpacity);

      expect(treeImageBg).toBeTruthy();
      expect(treeImageBg.props.source).toBe(treePhoto.hasOwnProperty('path') ? {uri: treePhoto.path} : treePhoto);

      expect(textsContainer).toBeTruthy();
      expect(stylesToOneObject(textsContainer.props.style).height).toBe(74);
      expect(stylesToOneObject(textsContainer.props.style).minWidth).toBe(178);
      expect(stylesToOneObject(textsContainer.props.style).backgroundColor).toBe(colors.khakiOpacity);

      expect(photoTitle).toBeTruthy();
      expect(photoTitle.props.children).toBe('submitTreeV2.photo');

      expect(photoDescription).toBeTruthy();
      expect(photoDescription.props.i18nKey).toBe('submitTreeV2.changePhoto');

      expect(cameraBtn).toBeTruthy();
      expect(cameraBtnText).toBeTruthy();
      expect(cameraBtnText.props.children).toBe('submitTreeV2.camera');
      expect(cameraIcon.props.name).toBe('camera');

      expect(galleryBtn).toBeTruthy();
      expect(galleryBtnText).toBeTruthy();
      expect(galleryBtnText.props.children).toBe('submitTreeV2.gallery');
      expect(galleryIcon.props.name).toBe('photo-video');
    });
  });
});
