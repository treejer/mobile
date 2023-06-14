import {MockedProviderProps} from '@apollo/client/testing';
import {render} from 'ranger-testUtils/testingLibrary';

import {mapboxPrivateToken} from 'services/config';
import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {Routes} from 'navigation/Navigation';
import document from 'screens/GreenBlock/screens/TreeDetails/graphql/TreeDetailQuery.graphql';
import TreeDetails from 'screens/GreenBlock/screens/TreeDetails';
import {treeDetail} from 'ranger-redux/modules/__test__/currentJourney/mock';
import {TestSubmissionStack} from 'ranger-testUtils/components/TestSubmissionStack/TestSubmissionStack';
import {Hex2Dec} from 'utilities/helpers/hex';
import {getStaticMapboxUrl} from 'utilities/helpers/getStaticMapUrl';

jest.mock('@react-navigation/native', () => {
  const real = jest.requireActual('@react-navigation/native');
  return {
    ...real,
    useRoute: () => ({
      params: {
        tree: {
          __typename: 'Tree',
          birthDate: '1668979659',
          countryCode: '0',
          funder: null,
          id: '0x3b9adde6',
          lastUpdate: {
            __typename: 'TreeUpdate',
            createdAt: '1670881320',
            id: '0x7',
            updateSpecs: 'Qme72YJxLB4XyQBjGH8oG8ej45d3gH6mcMU7BB1WFgdg6R',
            updateStatus: '3',
            updatedAt: '1670881596',
          },
          plantDate: '1668979680',
          planter: {__typename: 'Planter', id: '0x2adec9ea34c04731d84e6110edc9f63b999da0cb'},
          saleType: '0',
          treeSpecsEntity: {
            __typename: 'TreeSpec',
            animationUrl: '',
            attributes: '',
            description: '',
            diameter: '',
            externalUrl: '',
            id: '0xca',
            imageFs: '',
            imageHash: '',
            latitude: '37421998',
            locations: '',
            longitude: '-122084000',
            name: '',
            nursery: '',
            symbolFs: '',
            symbolHash: '',
            updates: JSON.stringify([
              {
                image: 'https://ipfs.treejer.com/ipfs/QmNmequ8qDf9XPv71mBEjLmfdGmiF6Hv2DDxFp9wtKXfN3',
                image_hash: 'QmNmequ8qDf9XPv71mBEjLmfdGmiF6Hv2DDxFp9wtKXfN3',
                created_at: '1668979659',
              },
              {
                image: 'https://ipfs.treejer.com/ipfs/QmWzisQoki1GGfxMWNjASD7muZnrgxowVaK1F9yiDHrGX3',
                image_hash: 'QmWzisQoki1GGfxMWNjASD7muZnrgxowVaK1F9yiDHrGX3',
                created_at: '1670881280',
              },
            ]),
          },
          treeStatus: '528',
        },
        treeId: '0x3b9adde6',
      },
    }),
  };
});

const mockQuery: MockedProviderProps['mocks'] = [
  {
    request: {
      query: document,
      variables: {
        id: '0x3b9adde6',
      },
    },
    result: {
      data: {
        tree: {
          ...treeDetail,
          treeSpecsEntity: {
            ...treeDetail.treeSpecsEntity,
            updates: JSON.stringify(treeDetail.treeSpecsEntity.updates),
          },
        },
      },
    },
  },
];

describe('TreeDetails screen', () => {
  it('TreeDetails screen should be defined', () => {
    expect(TreeDetails).toBeDefined();
    expect(typeof TreeDetails).toBe('function');
  });

  describe('TreeDetails', () => {
    let findElementByTestId;

    beforeEach(() => {
      const element = render(
        <TestSubmissionStack stack={Routes.GreenBlock} name={Routes.TreeDetails} component={<TreeDetails />} />,
        goerliReducers,
        mockQuery as any,
      );
      findElementByTestId = element.findByTestId;
    });

    it('elements/components should be defined', async () => {
      const loadingIndicator = await findElementByTestId('loading-indicator');
      expect(loadingIndicator).toBeTruthy();
      const screenTitleCpt = await findElementByTestId('screen-title-cpt');
      const treeImageCpt = await findElementByTestId('tree-image-cpt');

      const treeId = await findElementByTestId('tree-id-text');
      const treeUpdateBtn = await findElementByTestId('tree-update-btn');
      const treeGpsCoordsLabel = await findElementByTestId('tree-gpsCoords-label');
      const treePgsCoords = await findElementByTestId('tree-gpsCoords');
      const treeFunderLabel = await findElementByTestId('tree-funder-label');
      const treeFunder = await findElementByTestId('tree-funder');
      const treeLastUpdateLabel = await findElementByTestId('tree-lastUpdate-label');
      const treeLastUpdate = await findElementByTestId('tree-lastUpdate');
      const bornDateLabel = await findElementByTestId('born-date-label');
      const bornDate = await findElementByTestId('born-date');
      const openMapButton = await findElementByTestId('open-map-button');
      const treeLocationMap = await findElementByTestId('tree-location-image');
      const treePhotosCpt = await findElementByTestId('tree-photos-cpt');

      const staticMapUrl = getStaticMapboxUrl(
        mapboxPrivateToken,
        -122084000 / Math.pow(10, 6),
        37421998 / Math.pow(10, 6),
        600,
        300,
      );

      expect(screenTitleCpt).toBeTruthy();
      expect(treeImageCpt).toBeTruthy();
      expect(treeId).toBeTruthy();
      expect(treeId.props.children).toBe(Hex2Dec('0x3b9adde6'));
      expect(treeUpdateBtn).toBeTruthy();
      expect(treeGpsCoordsLabel).toBeTruthy();
      expect(treeGpsCoordsLabel.props.children).toBe('treeDetails.gpsCoords');
      expect(treePgsCoords).toBeTruthy();
      expect(treePgsCoords.props.children).toBe('treeDetails.coords');
      expect(treeFunderLabel).toBeTruthy();
      expect(treeFunderLabel.props.children).toBe('treeDetails.funder');
      expect(treeFunder).toBeTruthy();
      expect(treeFunder.props.children).toBe('treeDetails.notFounded');
      expect(treeLastUpdateLabel).toBeTruthy();
      expect(treeLastUpdateLabel.props.children).toBe('treeDetails.lastUpdate');
      expect(treeLastUpdate).toBeTruthy();
      expect(treeLastUpdate.props.children).toBe(new Date(1670881320 * 1000).toLocaleDateString());
      expect(bornDateLabel).toBeTruthy();
      expect(bornDateLabel.props.children).toBe('treeDetails.born');
      expect(bornDate).toBeTruthy();
      expect(bornDate.props.children).toBe(new Date(1668979680 * 1000).getFullYear());
      expect(openMapButton).toBeTruthy();
      expect(treeLocationMap).toBeTruthy();
      expect(treeLocationMap.props.source).toEqual({uri: staticMapUrl});
      expect(treePhotosCpt).toBeTruthy();
    });
  });
});
