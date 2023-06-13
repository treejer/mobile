import {render} from '@testing-library/react-native';

import {colors} from 'constants/values';
import {FilterTreeButton} from 'components/Filter/FilterTreeButton';
import {SubmittedTreeStatus} from 'utilities/helpers/treeInventory';
import {stylesToOneObject} from 'utilities/helpers/stylesToOneObject';
import {TreeImage} from '../../../../assets/icons';

describe('FilterTreeButton component', () => {
  it('FilterTreeButton component should be defined', () => {
    expect(FilterTreeButton).toBeDefined();
    expect(typeof FilterTreeButton).toBe('function');
  });

  describe('FilterTreeButton isActive = true', () => {
    const tree = {
      title: SubmittedTreeStatus.Verified,
      t: 'submittedFilter',
      count: 20,
      color: colors.green,
    };

    let getElementByTestId;
    beforeEach(() => {
      const element = render(
        <FilterTreeButton testID="filter-tree-button" tree={tree} isActive={true} onPress={() => {}} />,
      );
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const container = getElementByTestId('filter-tree-button');
      const imageContainer = getElementByTestId('filter-tree-button-image-container');
      const treeImage = getElementByTestId('filter-tree-image');
      const filterCount = getElementByTestId('filter-tree-count');
      const filterTitle = getElementByTestId('filter-tree-title');
      const dropShadow = getElementByTestId('drop-shadow');

      expect(container).toBeTruthy();
      expect(imageContainer).toBeTruthy();
      expect(treeImage).toBeTruthy();
      expect(filterCount).toBeTruthy();
      expect(filterTitle).toBeTruthy();

      expect(stylesToOneObject(imageContainer.props.style).backgroundColor).toBe(`${tree.color}59`);
      expect(stylesToOneObject(dropShadow.props.style).shadowColor).toBe(tree.color);
      expect(stylesToOneObject(imageContainer.props.style).width).toBe(56);
      expect(stylesToOneObject(imageContainer.props.style).height).toBe(56);

      expect(treeImage.props.source).toBe(TreeImage);
      expect(stylesToOneObject(treeImage.props.style).tintColor).toBe(tree.color);

      expect(filterCount.props.children).toBe(tree.count);
      expect(filterTitle.props.children).toBe(`${tree.t}.${tree.title}`);
    });
  });
  describe('FilterTreeButton isActive = false', () => {
    const tree = {
      title: SubmittedTreeStatus.Verified,
      t: 'submittedFilter',
      count: 20,
      color: colors.green,
    };

    let getElementByTestId;
    beforeEach(() => {
      const element = render(
        <FilterTreeButton testID="filter-tree-button" tree={tree} isActive={false} onPress={() => {}} />,
      );
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const container = getElementByTestId('filter-tree-button');
      const imageContainer = getElementByTestId('filter-tree-button-image-container');
      const treeImage = getElementByTestId('filter-tree-image');
      const filterCount = getElementByTestId('filter-tree-count');
      const filterTitle = getElementByTestId('filter-tree-title');
      const dropShadow = getElementByTestId('drop-shadow');

      expect(container).toBeTruthy();
      expect(imageContainer).toBeTruthy();
      expect(treeImage).toBeTruthy();
      expect(filterCount).toBeTruthy();
      expect(filterTitle).toBeTruthy();

      expect(stylesToOneObject(imageContainer.props.style).backgroundColor).toBe(`${tree.color}59`);
      expect(dropShadow.props.style).toBe(undefined);
      expect(stylesToOneObject(imageContainer.props.style).width).toBe(56);
      expect(stylesToOneObject(imageContainer.props.style).height).toBe(56);

      expect(treeImage.props.source).toBe(TreeImage);
      expect(stylesToOneObject(treeImage.props.style).tintColor).toBe(tree.color);

      expect(filterCount.props.children).toBe(tree.count);
      expect(filterTitle.props.children).toBe(`${tree.t}.${tree.title}`);
    });
  });
});
