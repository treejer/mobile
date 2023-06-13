import moment from 'moment/moment';
import {render} from 'ranger-testUtils/testingLibrary';

import {mapboxPrivateToken} from 'services/config';
import {NotVerifiedTreeItem} from 'components/TreeListV2/NotVerifiedTreeItem';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {notVerifiedTreesMock} from 'components/TreeListV2/__test__/NotVerifiedTrees.mock';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';

describe('NotVerifiedTreeItem component', () => {
  it('NotVerifiedTreeItem component should be defined', () => {
    expect(NotVerifiedTreeItem).toBeDefined();
    expect(typeof NotVerifiedTreeItem).toBe('function');
  });

  describe('Tree Item component withDetail=true', () => {
    let getElementByTestId;

    beforeEach(() => {
      const element = render(
        <NotVerifiedTreeItem tree={notVerifiedTreesMock[0]} testID="verified-tree-item-cpt" withDetail={true} />,
        {
          ...goerliReducers,
          settings: {
            locale: 'en',
          },
        },
      );
      getElementByTestId = element.getByTestId;
    });

    it('components/elements should be defined', () => {
      const treeImage = getElementByTestId('tree-image');
      const treeLocationImage = getElementByTestId('location-image');
      const createdAtDateLabel = getElementByTestId('createdAt-date-text');
      const createdAtDate = getElementByTestId('date-text-createdAt');
      const treeName = getElementByTestId('tree-name');

      const treeSpecs = JSON.parse(notVerifiedTreesMock[0].treeSpecs);

      const locationImage = getStaticMapboxUrl(
        mapboxPrivateToken,
        Number(treeSpecs.location.longitude) / Math.pow(10, 6),
        Number(treeSpecs.location.latitude) / Math.pow(10, 6),
        200,
        200,
      );

      expect(treeName).toBeTruthy();
      expect(treeName.props.children).toBe(notVerifiedTreesMock[0].nonce);

      expect(treeImage).toBeTruthy();
      expect(treeLocationImage).toBeTruthy();
      expect(treeLocationImage.props.source).toEqual({uri: locationImage});
      expect(createdAtDateLabel).toBeTruthy();
      expect(createdAtDateLabel.props.children).toBe('treeInventoryV2.createdAt');
      expect(createdAtDate).toBeTruthy();
      expect(createdAtDate.props.children).toBe(moment(notVerifiedTreesMock[0].createdAt).locale('en').fromNow());
    });
  });

  describe('Tree Item component withDetail=false', () => {
    let getElementByTestId, queryElementByTestId;

    beforeEach(() => {
      const element = render(<NotVerifiedTreeItem tree={notVerifiedTreesMock[1]} withDetail={false} />, {
        ...goerliReducers,
        settings: {
          locale: 'en',
        },
      });
      getElementByTestId = element.getByTestId;
      queryElementByTestId = element.queryByTestId;
    });

    it('components/elements should be defined', () => {
      const nurseryIcon = getElementByTestId('nursery-icon');
      const treeLocationImage = queryElementByTestId('location-image');
      const createdAtDateLabel = queryElementByTestId('createdAt-date-text');
      const createdAtDate = queryElementByTestId('date-text-createdAt');
      const treeName = getElementByTestId('tree-name');

      expect(treeName).toBeTruthy();
      expect(treeName.props.children).toBe(notVerifiedTreesMock[1].treeId);

      expect(nurseryIcon).toBeTruthy();
      expect(treeLocationImage).toBeFalsy();
      expect(createdAtDateLabel).toBeFalsy();
      expect(createdAtDate).toBeFalsy();
    });
  });
});
