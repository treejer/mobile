import {StartPlantButton} from 'components/StartPlantButton/StartPlantButton';
import {render} from '@testing-library/react-native';
import {colors} from 'constants/values';
import {stylesToOneObject} from 'utilities/helpers/stylesToOneObject';

describe('StartPlantButton component', () => {
  it('StartPlantButton component should be defined', () => {
    expect(StartPlantButton).toBeDefined();
    expect(typeof StartPlantButton).toBe('function');
  });

  describe('StartPlantButton type => single tree', () => {
    let getElementByTestId, queryElementByTestId;
    const caption = 'hello world';
    beforeEach(() => {
      const element = render(
        <StartPlantButton
          testID="single-start-plant-btn-cpt"
          onPress={() => {}}
          caption={caption}
          color={colors.grayLight}
          size="lg"
          type="single"
        />,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const btnContainer = getElementByTestId('single-start-plant-btn-cpt');
      const innerView = getElementByTestId('inner-view');
      const captionText = getElementByTestId('btn-caption');
      const countInput = queryElementByTestId('count-input');

      expect(btnContainer).toBeTruthy();
      expect(innerView).toBeTruthy();

      expect(captionText).toBeTruthy();
      expect(captionText.props.children).toBe(caption);

      expect(countInput).toBeFalsy();
    });
  });

  describe('StartPlantButton type => nursery', () => {
    let element, getElementByTestId, queryElementByTestId;

    beforeEach(() => {
      element = render(
        <StartPlantButton
          testID="single-start-plant-btn-cpt"
          onPress={() => {}}
          inputRef={jest.fn() as any}
          color={colors.grayLight}
          size="lg"
          type="nursery"
        />,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const btnContainer = getElementByTestId('single-start-plant-btn-cpt');
      const innerView = getElementByTestId('inner-view');
      const captionText = queryElementByTestId('btn-caption');
      const countInput = getElementByTestId('count-input');

      expect(btnContainer).toBeTruthy();
      expect(innerView).toBeTruthy();

      expect(captionText).toBeFalsy();

      expect(countInput).toBeTruthy();
    });
  });

  describe('StartPlantButton sizes', () => {
    it('single tree size = lg', () => {
      let getElementByTestId;
      const element = render(
        <StartPlantButton
          testID="start-plant-button-cpt"
          onPress={() => {}}
          caption="hello world"
          color={colors.grayLight}
          size="lg"
          type="single"
        />,
      );
      getElementByTestId = element.getByTestId;

      const startPlantBtn = getElementByTestId('start-plant-button-cpt');

      expect(stylesToOneObject(startPlantBtn.props.style).height).toBe(80);
      expect(stylesToOneObject(startPlantBtn.props.style).paddingHorizontal).toBe(20);

      const treeImage = getElementByTestId('tree-image');
      expect(stylesToOneObject(treeImage.props.style).height).toBe(54);
      expect(stylesToOneObject(treeImage.props.style).width).toBe(48);
      expect(stylesToOneObject(treeImage.props.style).tintColor).toBe(colors.grayLight);

      const innerView = getElementByTestId('inner-view');
      expect(stylesToOneObject(innerView.props.style).paddingHorizontal).toBe(16);

      const caption = getElementByTestId('btn-caption');
      expect(stylesToOneObject(caption.props.style).fontSize).toBe(18);
    });
    it('single tree size = sm', () => {
      let getElementByTestId;
      const element = render(
        <StartPlantButton
          testID="start-plant-button-cpt"
          onPress={() => {}}
          color={colors.grayLight}
          size="sm"
          type="single"
        />,
      );
      getElementByTestId = element.getByTestId;

      const startPlantBtn = getElementByTestId('start-plant-button-cpt');

      expect(stylesToOneObject(startPlantBtn.props.style).height).toBe(60);
      expect(stylesToOneObject(startPlantBtn.props.style).paddingHorizontal).toBe(16);

      const treeImage = getElementByTestId('tree-image');
      expect(stylesToOneObject(treeImage.props.style).height).toBe(38);
      expect(stylesToOneObject(treeImage.props.style).width).toBe(26);
      expect(stylesToOneObject(treeImage.props.style).tintColor).toBe(colors.grayLight);

      const innerView = getElementByTestId('inner-view');
      expect(stylesToOneObject(innerView.props.style).paddingHorizontal).toBe(8);

      const caption = getElementByTestId('btn-caption');
      expect(stylesToOneObject(caption.props.style).fontSize).toBe(12);
    });
    it('nursery size = lg', () => {
      let getElementByTestId, getAllElementByTestId;
      const element = render(
        <StartPlantButton
          testID="start-plant-button-cpt"
          onPress={() => {}}
          color={colors.grayLight}
          size="lg"
          type="nursery"
        />,
      );
      getElementByTestId = element.getByTestId;
      getAllElementByTestId = element.getAllByTestId;

      const startPlantBtn = getElementByTestId('start-plant-button-cpt');

      expect(stylesToOneObject(startPlantBtn.props.style).height).toBe(80);
      expect(stylesToOneObject(startPlantBtn.props.style).paddingHorizontal).toBe(20);

      const treeIcons = getAllElementByTestId('tree');

      for (let tree of treeIcons) {
        expect(tree.props.width).toBe(24);
        expect(tree.props.height).toBe(24);
      }

      const innerView = getElementByTestId('inner-view');
      expect(stylesToOneObject(innerView.props.style).paddingHorizontal).toBe(16);

      const countInput = getElementByTestId('count-input');
      expect(stylesToOneObject(countInput.props.style).fontSize).toBe(18);
    });
    it('nursery size = sm', () => {
      let getElementByTestId, getAllElementByTestId;
      const element = render(
        <StartPlantButton
          testID="start-plant-button-cpt"
          onPress={() => {}}
          color={colors.grayLight}
          size="sm"
          type="nursery"
        />,
      );
      getElementByTestId = element.getByTestId;
      getAllElementByTestId = element.getAllByTestId;

      const startPlantBtn = getElementByTestId('start-plant-button-cpt');

      expect(stylesToOneObject(startPlantBtn.props.style).height).toBe(60);
      expect(stylesToOneObject(startPlantBtn.props.style).paddingHorizontal).toBe(16);

      const treeIcons = getAllElementByTestId('tree');

      for (let tree of treeIcons) {
        expect(tree.props.width).toBe(16);
        expect(tree.props.height).toBe(16);
      }

      const innerView = getElementByTestId('inner-view');
      expect(stylesToOneObject(innerView.props.style).paddingHorizontal).toBe(8);

      const countInput = getElementByTestId('count-input');
      expect(stylesToOneObject(countInput.props.style).fontSize).toBe(12);
    });
  });
});
