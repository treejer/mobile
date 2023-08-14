import moment from 'moment';

import {goerliReducers} from 'components/SubmissionSettings/__test__/mock';
import {capitalize} from 'utilities/helpers/capitalize';
import {DraftType} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';

export const journey = {
  location: {
    latitude: 2000,
    longitude: 222,
  },
  isSingle: true,
  isNursery: false,
  isUpdate: false,
};

export const dateOne = new Date(jest.now()).toString();
export const dateTwo = new Date(jest.now()).toString();

export const draftListReducers = {
  ...goerliReducers,
  settings: {
    locale: 'en',
  },
  draftedJourneys: {
    drafts: [
      {
        name: 'SAMPLE',
        journey,
        draftType: DraftType.Draft,
        id: dateOne,
      },
      {
        name: `${capitalize(DraftType.Draft)} ${moment(dateTwo).locale('en').format('YYYY-MM-DD hh:mm:ss a')}`,
        journey,
        draftType: DraftType.Draft,
        id: dateTwo,
      },
    ],
  },
};
