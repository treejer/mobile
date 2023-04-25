import moment from 'moment/moment';

import {mapboxPrivateToken} from 'services/config';
import {TreeItemV2} from 'components/TreeListV2/TreeItemV2';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';
import {render} from 'ranger-testUtils/testingLibrary';
import {treeDetail} from 'ranger-redux/modules/__test__/currentJourney/mock';

describe('TreeItemV2 component', () => {
  it('TreeItemV2 component should be defined', () => {
    expect(TreeItemV2).toBeDefined();
    expect(typeof TreeItemV2).toBe('function');
  });

  describe('Tree Item component withDetail=true', () => {
    let getElementByTestId;

    beforeEach(() => {
      const element = render(<TreeItemV2 treeUpdateInterval={20} tree={treeDetail as any} withDetail={true} />, {
        ...goerliReducers,
        settings: {
          locale: 'en',
        },
      });
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const treeSymbol = getElementByTestId('tree-symbol-cpt');
      const treeLocationImage = getElementByTestId('location-image');
      const plantDateText = getElementByTestId('plant-date-text');
      const plantDate = getElementByTestId('plant-date-text-fromNow');
      const updateDateText = getElementByTestId('update-date-text');
      const updateDate = getElementByTestId('update-date-text-fromNow');

      const locationImage = getStaticMapboxUrl(
        mapboxPrivateToken,
        Number(treeDetail.treeSpecsEntity.longitude) / Math.pow(10, 6),
        Number(treeDetail.treeSpecsEntity.latitude) / Math.pow(10, 6),
        200,
        200,
      );

      expect(treeSymbol).toBeTruthy();
      expect(treeLocationImage).toBeTruthy();
      expect(treeLocationImage.props.source).toEqual({uri: locationImage});
      expect(plantDateText).toBeTruthy();
      expect(plantDateText.props.children).toBe('treeInventoryV2.bornDate');
      expect(plantDate).toBeTruthy();
      expect(plantDate.props.children).toBe(
        moment(Number(treeDetail.plantDate) * 1000)
          .locale('en')
          .fromNow(),
      );
      expect(updateDateText).toBeTruthy();
      expect(updateDateText.props.children).toBe('treeInventoryV2.lastUpdateDate');
      expect(updateDate).toBeTruthy();
      expect(updateDate.props.children).toBe(
        moment(Number(treeDetail.lastUpdate.createdAt) * 1000)
          .locale('en')
          .fromNow(),
      );
    });
  });

  describe('Tree Item component withDetail=false', () => {
    let getElementByTestId, queryElementByTestId;

    beforeEach(() => {
      const element = render(<TreeItemV2 treeUpdateInterval={20} tree={treeDetail as any} withDetail={false} />, {
        ...goerliReducers,
        settings: {
          locale: 'en',
        },
      });
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const treeSymbol = getElementByTestId('tree-symbol-cpt');
      const treeLocationImage = queryElementByTestId('location-image');
      const plantDateText = queryElementByTestId('plant-date-text');
      const plantDate = queryElementByTestId('plant-date-text-fromNow');
      const updateDateText = queryElementByTestId('update-date-text');
      const updateDate = queryElementByTestId('update-date-text-fromNow');

      expect(treeSymbol).toBeTruthy();
      expect(treeLocationImage).toBeFalsy();
      expect(plantDateText).toBeFalsy();
      expect(plantDate).toBeFalsy();
      expect(updateDateText).toBeFalsy();
      expect(updateDate).toBeFalsy();
    });
  });
});
