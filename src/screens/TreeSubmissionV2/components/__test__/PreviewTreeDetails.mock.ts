import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {TreeImage} from '../../../../../assets/icons';

export const singleTreeReducer = {
  ...goerliReducers,
  profile: {
    data: {
      plantingNonce: 2,
    },
  },
  currentJourney: {
    isSingle: true,
    isNursery: false,
    location: {
      latitude: 200000,
      longitude: 2402212,
    },
    photo: TreeImage,
    photoLocation: {
      latitude: 200000,
      longitude: 2402212,
    },
  },
};

export const updateLoadingReducer = {
  ...goerliReducers,
  profile: {
    data: {
      plantingNonce: 2,
    },
  },
  treeDetails: {
    data: null,
    loading: true,
  },
  currentJourney: {
    isSingle: true,
    isUpdate: true,
    treeIdToUpdate: '12121',
    isNursery: false,
    location: {
      latitude: 200000,
      longitude: 2402212,
    },
    photo: TreeImage,
    photoLocation: {
      latitude: 200000,
      longitude: 2402212,
    },
  },
};

export const updateTreeReducer = {
  ...goerliReducers,
  profile: {
    data: {
      plantingNonce: 2,
    },
  },
  treeDetails: {
    data: {
      id: '12121',
    },
  },
  currentJourney: {
    isSingle: true,
    isUpdate: true,
    treeIdToUpdate: '12121',
    isNursery: false,
    location: {
      latitude: 200000,
      longitude: 2402212,
    },
    photo: TreeImage,
    photoLocation: {
      latitude: 200000,
      longitude: 2402212,
    },
  },
};
