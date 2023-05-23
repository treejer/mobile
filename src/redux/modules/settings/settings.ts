import {select} from 'redux-saga/effects';
import {TReduxState} from '../../store';
import {defaultLocale} from 'services/config';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';

export type TSettings = {
  onBoardingDone: boolean;
  locale: string;
  useBiconomy: boolean;
  releaseDate: number;
  checkMetaData: boolean;
  showSupportChat: boolean;
};

export const initialSettingsState: TSettings = {
  onBoardingDone: false,
  locale: defaultLocale,
  releaseDate: 1672159176038,
  useBiconomy: true,
  checkMetaData: true,
  showSupportChat: false,
};

type TSettingsAction = {
  type: string;
  useBiconomy: boolean;
  checkMetaData: boolean;
  locale: string;
  showSupportChat: boolean;
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

export const CHANGE_USE_BICONOMY = 'CHANGE_USE_BICONOMY';
export function changeUseBiconomy(useBiconomy: boolean) {
  return {
    type: CHANGE_USE_BICONOMY,
    useBiconomy,
  };
}

export const CHANGE_CHECK_METADATA = 'CHANGE_CHECK_METADATA';
export function changeCheckMetaData(checkMetaData: boolean) {
  return {
    type: CHANGE_CHECK_METADATA,
    checkMetaData,
  };
}

export const SET_SHOW_SUPPORT_CHAT = 'SET_SHOW_SUPPORT_CHAT';
export function setShowSupportChat(showSupportChat: boolean) {
  return {type: SET_SHOW_SUPPORT_CHAT, showSupportChat};
}

export const settingsReducer = (state: TSettings = initialSettingsState, action: TSettingsAction): TSettings => {
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
    case CHANGE_USE_BICONOMY: {
      return {
        ...state,
        useBiconomy: action.useBiconomy,
      };
    }
    case CHANGE_CHECK_METADATA: {
      return {
        ...state,
        checkMetaData: action.checkMetaData,
      };
    }
    case SET_SHOW_SUPPORT_CHAT:
      return {
        ...state,
        showSupportChat: action.showSupportChat,
      };

    default: {
      return state;
    }
  }
};

export type TUseSettings = TReduxState['settings'] & {
  updateLocale: (newLocale: string) => void;
  markOnBoardingDone: () => void;
  changeUseBiconomy: (useGSN: boolean) => void;
  changeCheckMetaData: (checkMetaData: boolean) => void;
  resetOnBoardingData: () => void;
  setShowSupportChat: (showSupportChat: boolean) => void;
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

  const handleChangeUseBiconomy = (useBiconomy: boolean) => {
    dispatch(changeUseBiconomy(useBiconomy));
  };

  const handleChangeCheckMetaData = (checkMetaData: boolean) => {
    dispatch(changeCheckMetaData(checkMetaData));
  };

  const handleShowSupportChat = (showSupportChat: boolean) => {
    dispatch(setShowSupportChat(showSupportChat));
  };

  return {
    ...settings,
    updateLocale: handleChangeLocale,
    markOnBoardingDone: handleMarkOnBoardingDone,
    changeUseBiconomy: handleChangeUseBiconomy,
    resetOnBoardingData: handleResetOnBoarding,
    setShowSupportChat: handleShowSupportChat,
    changeCheckMetaData: handleChangeCheckMetaData,
  };
}

export function* selectSettings() {
  return yield select((state: TReduxState) => state.settings);
}

export const getSettings = (state: TReduxState) => state.settings;
