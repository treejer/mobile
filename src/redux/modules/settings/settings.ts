import {select} from 'redux-saga/effects';
import {TReduxState} from 'redux/store';
import {defaultLocale} from 'services/config';

export type TSettings = {
  onBoardingDone: boolean;
  locale: string;
  useGGN: boolean;
};

const initialState: TSettings = {
  onBoardingDone: false,
  locale: defaultLocale,
  useGGN: true,
};

type TSettingsAction = {
  type: string;
  useGGN: boolean;
  locale: string;
};

export const MARK_ONBOARDING_DONE = 'MARK_ONBOARDING_DONE';
export function markOnBoardingDone() {
  return {type: MARK_ONBOARDING_DONE};
}

export const RESET_ONBOARDING_DATA = 'RESET_ONBOARDING_DATA';
export function resetOnBoardingData() {
  return {type: RESET_ONBOARDING_DATA};
}

export const UPDATE_LOCALE = 'UPDATE_LOCALE';
export function updateLocale(newLocale: string) {
  return {type: UPDATE_LOCALE, payload: newLocale};
}

export const CHANGE_USE_GGN = 'CHANGE_USE_GGN';
export function changeUseGGN(useGGN: boolean) {
  return {
    type: CHANGE_USE_GGN,
    payload: useGGN,
  };
}

export const settingsReducer = (state: TSettings = initialState, action: TSettingsAction): TSettings => {
  switch (action.type) {
    case MARK_ONBOARDING_DONE: {
      return {
        ...state,
        onBoardingDone: true,
      };
    }
    case RESET_ONBOARDING_DATA: {
      return {
        ...state,
        onBoardingDone: false,
      };
    }
    case UPDATE_LOCALE: {
      return {
        ...state,
        locale: action.locale,
      };
    }
    case CHANGE_USE_GGN: {
      return {
        ...state,
        useGGN: action.useGGN,
      };
    }

    default: {
      return state;
    }
  }
};

export function* selectSettings() {
  return yield select((state: TReduxState) => state.settings);
}
