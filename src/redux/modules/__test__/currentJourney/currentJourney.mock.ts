import {onBoardingOne} from '../../../../../assets/images';
import config, {BlockchainNetwork} from 'services/config';
import {treeDetail} from 'ranger-redux/modules/__test__/currentJourney/mock';
import {TUserStatus} from 'webServices/profile/profile';

export const mockPlantJourneyWithDraftId = {
  draftId: 'hehehehe',
  photo: onBoardingOne,
  location: {
    latitude: 200000,
    longitude: 5321122,
  },
  photoLocation: {
    latitude: 200000,
    longitude: 5321122,
  },
  isUpdate: false,
  isSingle: true,
  isNursery: false,
  treeIdToUpdate: undefined,
  treeIdToPlant: undefined,
};

export const mockPlantJourneyWithoutDraftId = {
  photo: onBoardingOne,
  location: {
    latitude: 200000,
    longitude: 5321122,
  },
  photoLocation: {
    latitude: 200000,
    longitude: 5321122,
  },
  isUpdate: false,
  isSingle: true,
  isNursery: false,
  treeIdToUpdate: undefined,
  treeIdToPlant: undefined,
};

export const mockUpdateJourneyWithDraftId = {
  draftId: '212',
  photo: onBoardingOne,
  tree: treeDetail,
  location: {
    latitude: 200000,
    longitude: 5321122,
  },
  photoLocation: {
    latitude: 200000,
    longitude: 5321122,
  },
  isUpdate: true,
  isSingle: true,
  isNursery: false,
  treeIdToUpdate: '21212',
  treeIdToPlant: undefined,
};

export const mockUpdateJourneyWithoutDraftId = {
  photo: onBoardingOne,
  tree: treeDetail,
  location: {
    latitude: 200000,
    longitude: 5321122,
  },
  photoLocation: {
    latitude: 200000,
    longitude: 5321122,
  },
  isUpdate: true,
  isSingle: true,
  isNursery: false,
  treeIdToUpdate: '21212',
  treeIdToPlant: undefined,
};
export const mockAssignedJourneyWithDraftId = {
  draftId: '2121',
  photo: onBoardingOne,
  tree: treeDetail,
  location: {
    latitude: 200000,
    longitude: 5321122,
  },
  photoLocation: {
    latitude: 200000,
    longitude: 5321122,
  },
  isUpdate: false,
  isSingle: true,
  isNursery: false,
  treeIdToUpdate: undefined,
  treeIdToPlant: 'IDIDIDID',
};
export const mockAssignedJourneyWithoutDraftId = {
  photo: onBoardingOne,
  tree: treeDetail,
  location: {
    latitude: 200000,
    longitude: 5321122,
  },
  photoLocation: {
    latitude: 200000,
    longitude: 5321122,
  },
  isUpdate: false,
  isSingle: true,
  isNursery: false,
  treeIdToUpdate: undefined,
  treeIdToPlant: 'IDIDIDID',
};
export const mockProfile = {
  _id: 'ID',
  createdAt: 'Date',
  email: 'dev@gmail.com',
  emailVerifiedAt: '2023-05-14T20:34:23.075Z',
  firstName: 'Developer',
  idCard: 'ID',
  userStatus: TUserStatus.Verified,
  lastName: 'TEST',
  mobile: 'number',
  mobileCountry: 'country',
  mobileVerifiedAt: 'Date',
  plantingNonce: 2,
  updatedAt: 'Date',
};

export const mockMainnetConfig = config[BlockchainNetwork.MaticMain];
export const mockConfig = config[BlockchainNetwork.Goerli];
export const mockMagic = {
  rpcProvider: {
    request: () => 'signature',
  },
};
export const mockWallet = 'address';
