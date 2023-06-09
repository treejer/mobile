import {render} from '@testing-library/react-native';

import {colors} from 'constants/values';
import {NotVerifiedTreeImage} from 'components/TreeListV2/NotVerifiedTreeImage';
import {notVerifiedTreesMock} from 'components/TreeListV2/__test__/NotVerifiedTrees.mock';
import {stylesToOneObject} from 'utilities/helpers/stylesToOneObject';
import {TreeImage} from '../../../../assets/icons';

describe('NotVerifiedTreeImage component', () => {
  it('NotVerifiedTreeImage component should be defined', () => {
    expect(NotVerifiedTreeImage).toBeDefined();
    expect(typeof NotVerifiedTreeImage).toBe('function');
  });
  describe('NotVerifiedTreeImage', () => {
    describe('NotVerifiedTreeImage single tree', () => {
      let getElementByTestId;
      beforeEach(() => {
        const element = render(
          <NotVerifiedTreeImage tree={notVerifiedTreesMock[0]} tint testID="tree-image" size={60} />,
        );
        getElementByTestId = element.getByTestId;
      });

      it('elements/components should be defined', () => {
        const treeImage = getElementByTestId('tree-image');
        expect(treeImage).toBeTruthy();
        expect(treeImage.props.source).toEqual(TreeImage);
        expect(stylesToOneObject(treeImage.props.style).tintColor).toBe(colors.gray);
      });
    });
  });
  describe('NotVerifiedTreeImage', () => {
    describe('NotVerifiedTreeImage nursery', () => {
      let getElementByTestId;
      beforeEach(() => {
        const element = render(<NotVerifiedTreeImage tree={notVerifiedTreesMock[1]} testID="tree-image" size={60} />);
        getElementByTestId = element.getByTestId;
      });

      it('elements/components should be defined', () => {
        const treeImage = getElementByTestId('tree-image');
        expect(treeImage).toBeTruthy();
        expect(treeImage.props.children.length).toBe(2);
      });
    });
  });
  describe('NotVerifiedTreeImage', () => {
    describe('NotVerifiedTreeImage assigned', () => {
      let getElementByTestId;
      beforeEach(() => {
        const element = render(<NotVerifiedTreeImage tree={notVerifiedTreesMock[3]} testID="tree-image" size={60} />);
        getElementByTestId = element.getByTestId;
      });

      it('elements/components should be defined', () => {
        const treeImage = getElementByTestId('tree-image');
        expect(treeImage).toBeTruthy();
        expect(treeImage.props.source).toEqual({uri: 'hello photo'});
        expect(stylesToOneObject(treeImage.props.style)?.tintColor).toBe(undefined);
      });
    });
  });
});
