import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {CountryCode} from 'react-native-country-picker-modal';

export const USER_ONBOARDED = 'USER_ONBOARDED';
export const userOnboarded = () => ({
  type: USER_ONBOARDED,
});

export const SET_PHONE_NUMBER = 'SET_PHONE_NUMBER';
export const setPhoneNumber = (phone: ClientPhone) => ({
  type: SET_PHONE_NUMBER,
  phone,
});

export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const userLoggedIn = (loggedIn: boolean) => ({
  type: USER_LOGGED_IN,
  loggedIn,
});

export type ClientPhone = {
  countryCode: string;
  mobile: string;
  country: CountryCode;
};

export type ClientAuthState = {
  onboarded: boolean;
  loggedIn: boolean;
  init: boolean;
  phone?: ClientPhone;
};

export const clientAuthInitialState: ClientAuthState = {
  onboarded: false,
  loggedIn: false,
  init: true,
};

export type ClientAuthAction = {
  type: string;
  phone: ClientPhone;
  loggedIn: boolean;
  init: boolean;
};

export function clientAuth(state: ClientAuthState = clientAuthInitialState, action: ClientAuthAction) {
  switch (action.type) {
    case USER_ONBOARDED: {
      return {
        ...state,
        onboarded: true,
      };
    }
    case USER_LOGGED_IN: {
      return {
        ...state,
        loggedIn: action.loggedIn,
      };
    }
    case SET_PHONE_NUMBER: {
      return {
        ...state,
        phone: action.phone,
      };
    }
    default:
      return state;
  }
}

export function useClientAuth() {
  const dispatch = useAppDispatch();
  const _clientAuth = useAppSelector(state => state.clientAuth);

  const dispatchSetPhoneNumber = (phone: ClientPhone) => {
    dispatch(setPhoneNumber(phone));
  };

  const dispatchOnboarded = () => {
    dispatch(userOnboarded());
  };

  const dispatchUserLoggedIn = () => {
    dispatch(userLoggedIn(true));
  };

  const dispatchUserLoggedOut = () => {
    dispatch(userLoggedIn(false));
  };

  return {
    ...(_clientAuth || {}),
    dispatchOnboarded,
    dispatchSetPhoneNumber,
    dispatchUserLoggedIn,
    dispatchUserLoggedOut,
  };
}
