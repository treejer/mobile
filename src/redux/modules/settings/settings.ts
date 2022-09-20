import {select} from 'redux-saga/effects';
import {TReduxState} from '../../store';
import {defaultLocale} from 'services/config';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';

export type TSettings = {
  onBoardingDone: boolean;
  locale: string;
  useGSN: boolean;
};

const initialState: TSettings = {
  onBoardingDone: false,
  locale: defaultLocale,
  useGSN: true,
};

type TSettingsAction = {
  type: string;
  useGSN: boolean;
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
  return {type: UPDATE_LOCALE, locale: newLocale};
}

export const CHANGE_USE_GSN = 'CHANGE_USE_GSN';
export function changeUseGSN(useGSN: boolean) {
  return {
    type: CHANGE_USE_GSN,
    useGSN: useGSN,
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
    case CHANGE_USE_GSN: {
      return {
        ...state,
        useGSN: action.useGSN,
      };
    }

    default: {
      return state;
    }
  }
};

export type TUseSettings = TReduxState['settings'] & {
  updateLocale: (newLocale: string) => void;
  markOnBoardingDone: () => void;
  changeUseGSN: (useGSN: boolean) => void;
  resetOnBoardingData: () => void;
};

export function useSettings(): TUseSettings {
  const settings = useAppSelector(state => state.settings);
  const dispatch = useAppDispatch();

  const handleMarkOnBoardingDone = () => {
    dispatch(markOnBoardingDone());
  };

  const handleResetOnBoarding = () => {
    dispatch(resetOnBoardingData());
  };

  const handleChangeLocale = (newLocale: string) => {
    dispatch(updateLocale(newLocale));
  };

  const handleChangeUseGSN = (useGSN: boolean) => {
    dispatch(changeUseGSN(useGSN));
  };

  return {
    ...settings,
    updateLocale: handleChangeLocale,
    markOnBoardingDone: handleMarkOnBoardingDone,
    changeUseGSN: handleChangeUseGSN,
    resetOnBoardingData: handleResetOnBoarding,
  };
}

export function* selectSettings() {
  return yield select((state: TReduxState) => state.settings);
}
