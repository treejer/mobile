import {TreeJourney} from 'screens/TreeSubmission/types';

export type UserActionEvent<Data> = {
  type: string;
  route: string;
  data: Data;
  message?: string;
  error?: any;
};

export function userActivityEvent<Data>(action: UserActionEvent<Data>) {}
