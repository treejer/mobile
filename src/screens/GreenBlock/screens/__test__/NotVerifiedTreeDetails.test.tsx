import {render} from 'ranger-testUtils/testingLibrary';

import {mapboxPrivateToken} from 'services/config';
import {Routes} from 'navigation/Navigation';
import {NotVerifiedTreeDetails} from 'screens/GreenBlock/screens/TreeDetails/NotVerifiedTreeDetails';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {TestSubmissionStack} from 'ranger-testUtils/components/TestSubmissionStack/TestSubmissionStack';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';

jest.mock('@react-navigation/native', () => {
  const real = jest.requireActual('@react-navigation/native');
  return {
    ...real,
    useRoute: () => ({
      params: {
        tree: {
          _id: '1',
          signer: 'string',
          nonce: 2,
          treeSpecs: 'Hash',
          treeSpecsJSON: JSON.stringify({
            location: {latitude: 2000000, longitude: 213213123123},
            updates: [
              {
                created_at: '1667322860',
                image: 'https://ipfs.treejer.com/ipfs/QmbF9x6GgZ2D4U9kGeapt1KsHzq3612jQ3FS1KEK2ZAqW9',
                image_hash: 'QmbF9x6GgZ2D4U9kGeapt1KsHzq3612jQ3FS1KEK2ZAqW9',
              },
              {
                created_at: '1670881193',
                image: 'https://ipfs.treejer.com/ipfs/QmWNFt2fhRptJUNr5PZjdLoCycU9cptpgSrZ4X52JPNdYH',
                image_hash: 'QmWNFt2fhRptJUNr5PZjdLoCycU9cptpgSrZ4X52JPNdYH',
              },
              {
                created_at: '1685186095',
                image: 'https://ipfs.treejer.com/ipfs/QmYZcettkHRhSoSnfsSV8pXPTmPKVGGawNupoergPUoAWN',
                image_hash: 'QmYZcettkHRhSoSnfsSV8pXPTmPKVGGawNupoergPUoAWN',
              },
            ],
          }),
          status: 2,
          treeId: '11002',
          createdAt: '2023-05-27T11:15:10.090Z',
          updatedAt: '2023-05-27T11:15:10.090Z',
        },
      },
    }),
  };
});

describe('NotVerifiedTreeDetails component', () => {
  it('NotVerifiedTreeDetails component should be defined', () => {
    expect(NotVerifiedTreeDetails).toBeDefined();
    expect(typeof NotVerifiedTreeDetails).toBe('function');
  });

  describe('NotVerifiedTreeDetail', () => {
    let getElementByTestId;
    beforeEach(() => {
      const element = render(
        <TestSubmissionStack
          name={Routes.NotVerifiedTreeDetails}
          component={<NotVerifiedTreeDetails />}
          stack={Routes.GreenBlock}
        />,
        goerliReducers,
      );
      getElementByTestId = element.getByTestId;
    });

    it('elements/components should be defined', () => {
      const screenTitle = getElementByTestId('screen-title-cpt');
      const treeImage = getElementByTestId('tree-image-cpt');
      const treeName = getElementByTestId('tree-name');
      const treeDeleteBtn = getElementByTestId('tree-delete-btn');
      const treeCoordsLabel = getElementByTestId('tree-coords-label');
      const treeCoords = getElementByTestId('tree-coords');
      const treeCreatedAtDateLabel = getElementByTestId('tree-createdAt-date-label');
      const treeCreatedAtDate = getElementByTestId('tree-createdAt-date');
      const treeIdLabel = getElementByTestId('tree-id-label');
      const treeId = getElementByTestId('tree-id');
      const treeLocationBtn = getElementByTestId('tree-location-btn');
      const treeLocationImage = getElementByTestId('tree-location-image');
      const treePhotos = getElementByTestId('tree-photos-slider');

      const staticMapUrl = getStaticMapboxUrl(
        mapboxPrivateToken,
        213213123123 / Math.pow(10, 6),
        2000000 / Math.pow(10, 6),
        600,
        300,
      );

      expect(screenTitle).toBeTruthy();
      expect(treeImage).toBeTruthy();

      expect(treeName).toBeTruthy();
      expect(treeName.props.children).toBe(2);

      expect(treeDeleteBtn).toBeTruthy();

      expect(treeCoordsLabel).toBeTruthy();
      expect(treeCoordsLabel.props.children).toBe('notVerifiedTreeDetails.gpsCoords');

      expect(treeCoords).toBeTruthy();
      expect(treeCoords.props.children).toBe('notVerifiedTreeDetails.coords');

      expect(treeCreatedAtDateLabel).toBeTruthy();
      expect(treeCreatedAtDateLabel.props.children).toBe('notVerifiedTreeDetails.createdAt');

      expect(treeCreatedAtDate).toBeTruthy();
      expect(treeCreatedAtDate.props.children).toBe(new Date('2023-05-27T11:15:10.090Z').toLocaleDateString());

      expect(treeIdLabel).toBeTruthy();
      expect(treeIdLabel.props.children).toBe('notVerifiedTreeDetails.treeId');

      expect(treeId).toBeTruthy();
      expect(treeId.props.children).toEqual(['#', '11002']);

      expect(treeLocationBtn).toBeTruthy();

      expect(treeLocationImage).toBeTruthy();
      expect(treeLocationImage.props.source).toEqual({uri: staticMapUrl});

      expect(treePhotos).toBeTruthy();
    });
  });
});
