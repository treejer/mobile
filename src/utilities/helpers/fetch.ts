import axios, {AxiosError, AxiosRequestConfig} from 'axios';

import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';
import {i18next} from '../../localization';
import {put, select} from 'redux-saga/effects';
import {TReduxState} from 'redux/store';
import {removeToken} from '../../redux/modules/token/token';
import {userLoggedIn} from '../../redux/modules/auth/clientAuth';
import {debugFetch} from 'services/config';
import {selectSettings} from '../../redux/modules/settings/settings';

export type FetchResult<Data> = {
  result: Data;
  status: number;
};

export function fetch<Data, Form = any>(url, options: AxiosRequestConfig<Form> = {}): Promise<FetchResult<Data>> {
  return new Promise((resolve, reject) => {
    return axios(url, {
      ...options,
      timeout: 10000,
    })
      .then(res => {
        if (debugFetch) {
          console.log(url, res.data, 'res is here', res.status);
        }
        if (res.status) {
          if (res.status.toString().split('')[0] === '2') {
            return resolve({
              result: res.data.result,
              status: res.status,
            });
          } else {
            return reject(res);
          }
        } else {
          return reject({
            message: 'errors.INTERNET',
            translate: true,
          });
        }
      })
      .catch(e => {
        if (debugFetch) {
          console.log(JSON.parse(JSON.stringify(e)), e, 'error inside fetch');
        }
        reject(e);
      });
  });
}

export function* sagaFetch<Data, Form = any>(url, options: AxiosRequestConfig<Form> = {}) {
  const {token} = yield select((state: TReduxState) => state.token);
  if (token) {
    options = {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    };
  }

  return yield fetch<Data, Form>(url, options);
}

type ClientError = {
  status?: number;
  message?: string;
};

export const handleFetchError = (e: AxiosError<ClientError>): ClientError => {
  const {message, response} = e;
  const {status, data} = response || {};

  const _message = data?.message ?? message;

  return {
    status,
    message: _message,
  };
};

export type HandleSagaFetchErrorOptions = {
  showErrorAlert?: boolean;
};

export function* handleSagaFetchError(e: AxiosError<ClientError>, options: HandleSagaFetchErrorOptions = {}) {
  const {showErrorAlert = true} = options;
  const {locale}: TReduxState['settings'] = yield selectSettings();
  const {message, status} = handleFetchError(e);
  if (showErrorAlert && message && message?.length) {
    yield showSagaAlert({
      title: status ? i18next.t(`errors.${status}`, {lng: locale}) : undefined,
      message: Array.isArray(message) ? message[0] : message,
      mode: AlertMode.Error,
      buttons: [
        {
          text: i18next.t('ok', {lng: locale}),
        },
      ],
    });
  }

  if (status === 401) {
    yield put(removeToken());
    yield put(userLoggedIn(false));
  }
}
