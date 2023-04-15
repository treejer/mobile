import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {DraftType} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {onBoardingOne} from '../../../../../assets/images';

const idOne = new Date(jest.now());
const idTwo = new Date(jest.now());

const draftOne = {
  id: idOne,
  name: `${DraftType.Draft} ${idOne}`,
  journey: {
    isSingle: true,
    isNursery: false,
    isUpdate: false,
    photo: onBoardingOne,
    photoLocation: {
      latitude: 20000,
      longitude: 20000,
    },
    location: {
      latitude: 20000,
      longitude: 20000,
    },
  },
};

const draftTwo = {
  id: idTwo,
  name: `${DraftType.Draft} ${idTwo}`,
  journey: {
    isSingle: true,
    isNursery: false,
    isUpdate: false,
    photo: onBoardingOne,
    photoLocation: {
      latitude: 20000,
      longitude: 20000,
    },
    location: {
      latitude: 20000,
      longitude: 20000,
    },
  },
};

export const reducersWithDraftsAndTreeList = {
  ...goerliReducers,
  draftedJourneys: {
    drafts: [draftTwo, draftOne],
  },
};
