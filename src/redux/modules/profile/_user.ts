import {call, put, takeEvery} from 'redux-saga/effects';
import {selectConfig} from '../web3/web3';
import {NetworkConfig} from 'services/config';

export type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerifiedAt?: string | null;
  idCard?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  mobile?: string | null;
  mobileCountry?: string | null;
  mobileVerifiedAt?: string | null;
  isVerified: boolean;
};

export type TUserState = {
  loading: boolean;
  error: string;
  errorCode: number | string;
  user: TUser | null;
};

export const initialState: TUserState = {
  loading: true,
  error: '',
  errorCode: '',
  user: null,
};

export type TError = {
  message: string;
  errorCode: number | string;
};

export type TFetchUserRequest = {
  userId: string;
  accessToken: string;
};

export type TUserAction = {
  type: string;
  user: TUser;
  error: TError;
  fetchData: TFetchUserRequest;
};

export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';

export function fetchUserRequest() {
  return {type: FETCH_USER_REQUEST};
}

export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export function fetchUserSuccess(user: TUser) {
  return {type: FETCH_USER_SUCCESS, user};
}

export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export function fetchUserFailure(error: TError) {
  return {type: FETCH_USER_FAILURE, error};
}

export const userReducer = (state: TUserState = initialState, action: TUserAction) => {
  switch (action.type) {
    case FETCH_USER_REQUEST: {
      return state;
    }
    case FETCH_USER_SUCCESS: {
      return {
        loading: false,
        user: action.user,
        error: '',
        errorCode: '',
      };
    }
    case FETCH_USER_FAILURE: {
      return {
        loading: false,
        user: null,
        error: action.error.message,
        errorCode: action.error.errorCode,
      };
    }
    default: {
      return state;
    }
  }
};

export function* watchFetchUserRequest(action: TUserAction) {
  try {
    const {accessToken, userId} = action.fetchData;
    const config: NetworkConfig = yield selectConfig();
    // throw new Error('hy madad');
    const headers = {
      'x-auth-userid': userId,
      'x-auth-logintoken': accessToken,
      Accept: 'application/json',
    };
    const response = yield call(() => fetch(`${config.treejerApiUrl}/user/getme/user`, {method: 'GET', headers}));
    const userData = yield response.json();
    if (userData?.statusCode) {
      yield put(fetchUserFailure({errorCode: userData?.errorCode, message: userData?.message}));
    } else {
      yield put(fetchUserSuccess(userData));
    }
  } catch (error: any) {
    console.log(error, 'user error is here');
  }
}

export function* userSagas() {
  yield takeEvery(FETCH_USER_REQUEST, watchFetchUserRequest);
}
