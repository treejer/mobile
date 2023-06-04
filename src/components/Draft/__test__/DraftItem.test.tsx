import {render} from 'ranger-testUtils/testingLibrary';

import {DraftType} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {DraftItem} from 'components/Draft/DraftItem';
import {draftListReducers, journey} from 'components/Draft/__test__/DraftList.mock';
import {colors} from 'constants/values';
import {TreeImage} from '../../../../assets/icons';

describe('DraftItem component', () => {
  it('DraftItem component should be defined', () => {
    expect(DraftItem).toBeDefined();
    expect(typeof DraftItem).toBe('function');
  });

  describe('DraftItem isNursery', () => {
    let getElementByTestId, queryElementByTestId;

    const dateOne = new Date(jest.now()).toString();

    beforeEach(() => {
      const element = render(
        <DraftItem
          draft={{
            name: 'SAMPLE',
            journey: {
              ...journey,
              isSingle: false,
              isNursery: true,
              nurseryCount: 2,
            },
            draftType: DraftType.Draft,
            id: dateOne,
            createdAt: new Date(dateOne),
            updatedAt: new Date(dateOne),
          }}
          onPressDraft={() => {}}
          onRemoveDraft={() => {}}
        />,
        draftListReducers,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const draftButton = getElementByTestId(`draft-item-button-${dateOne}`);
      const draftIcon = getElementByTestId('nursery-icon');
      const draftName = getElementByTestId('draft-name');
      const draftPassageTime = getElementByTestId('draft-passage-time');
      const treeImage = queryElementByTestId('tree-image');
      const removeButton = getElementByTestId(`remove-draft-button-${dateOne}`);
      const removeIcon = getElementByTestId(`remove-icon`);

      expect(draftIcon).toBeTruthy();
      expect(draftButton).toBeTruthy();
      expect(draftName).toBeTruthy();
      expect(draftName.props.children).toBe('SAMPLE');
      expect(draftPassageTime).toBeTruthy();
      expect(treeImage).toBeFalsy();

      expect(removeButton).toBeTruthy();
      expect(removeIcon).toBeTruthy();
      expect(removeIcon.props.name).toBe('trash-alt');
      expect(removeIcon.props.color).toBe(colors.red);
    });
  });

  describe('DraftItem isSingle', () => {
    let getElementByTestId, queryElementByTestId;

    const dateOne = new Date(jest.now()).toString();

    beforeEach(() => {
      const element = render(
        <DraftItem
          draft={{
            name: 'SAMPLE',
            journey: {
              ...journey,
              isSingle: true,
              isNursery: false,
            },
            draftType: DraftType.Draft,
            id: dateOne,
            createdAt: new Date(dateOne),
            updatedAt: new Date(dateOne),
          }}
          onPressDraft={() => {}}
          onRemoveDraft={() => {}}
        />,
        draftListReducers,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const draftButton = getElementByTestId(`draft-item-button-${dateOne}`);
      const treeImage = getElementByTestId('tree-image');
      const draftName = getElementByTestId('draft-name');
      const draftPassageTime = getElementByTestId('draft-passage-time');
      const draftIcon = queryElementByTestId('nursery-icon');
      const removeButton = getElementByTestId(`remove-draft-button-${dateOne}`);
      const removeIcon = getElementByTestId(`remove-icon`);

      expect(treeImage).toBeTruthy();
      expect(treeImage.props.source).toBe(TreeImage);
      expect(draftButton).toBeTruthy();
      expect(draftName).toBeTruthy();
      expect(draftName.props.children).toBe('SAMPLE');
      expect(draftPassageTime).toBeTruthy();
      expect(draftIcon).toBeFalsy();

      expect(removeButton).toBeTruthy();
      expect(removeIcon).toBeTruthy();
      expect(removeIcon.props.name).toBe('trash-alt');
      expect(removeIcon.props.color).toBe(colors.red);
    });
  });

  describe('DraftItem assigned', () => {
    let getElementByTestId, queryElementByTestId;

    const dateOne = new Date(jest.now()).toString();

    beforeEach(() => {
      const element = render(
        <DraftItem
          draft={{
            name: 'SAMPLE',
            journey: {
              ...journey,
              tree: {
                treeSpecsEntity: {
                  imageFs: 'imageFs',
                } as any,
              } as any,
              isSingle: true,
              isNursery: false,
            },
            draftType: DraftType.Draft,
            id: dateOne,
            createdAt: new Date(dateOne),
            updatedAt: new Date(dateOne),
          }}
          onPressDraft={() => {}}
          onRemoveDraft={() => {}}
        />,
        draftListReducers,
      );
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const draftButton = getElementByTestId(`draft-item-button-${dateOne}`);
      const treeImage = getElementByTestId('tree-imageFs');
      const draftName = getElementByTestId('draft-name');
      const draftPassageTime = getElementByTestId('draft-passage-time');
      const draftIcon = queryElementByTestId('nursery-icon');
      const removeButton = getElementByTestId(`remove-draft-button-${dateOne}`);
      const removeIcon = getElementByTestId(`remove-icon`);

      expect(treeImage).toBeTruthy();
      expect(treeImage.props.source).toEqual({uri: 'imageFs'});
      expect(draftButton).toBeTruthy();
      expect(draftName).toBeTruthy();
      expect(draftName.props.children).toBe('SAMPLE');
      expect(draftPassageTime).toBeTruthy();
      expect(draftIcon).toBeFalsy();

      expect(removeButton).toBeTruthy();
      expect(removeIcon).toBeTruthy();
      expect(removeIcon.props.name).toBe('trash-alt');
      expect(removeIcon.props.color).toBe(colors.red);
    });
  });
});
