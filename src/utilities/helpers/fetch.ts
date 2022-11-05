import axios, {AxiosError, AxiosRequestConfig} from 'axios';

import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';
import {i18next} from '../../localization';
import {put, select} from 'redux-saga/effects';
import {TReduxState} from 'ranger-redux/store';
import {debugFetch, NetworkConfig} from 'services/config';
import {selectSettings} from 'ranger-redux/modules/settings/settings';
import {clearUserNonce, selectConfig} from 'ranger-redux/modules/web3/web3';
import {profileActions} from 'ranger-redux/modules/profile/profile';

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
              result: res.data,
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

export type SagaFetchOptions = {
  configUrl: keyof NetworkConfig;
};

export function* sagaFetch<Data, Form = any>(
  url: string,
  _options: SagaFetchOptions & AxiosRequestConfig<Form> = {configUrl: 'treejerApiUrl'},
) {
  const {accessToken, userId} = yield select((state: TReduxState) => state.web3);
  const config: NetworkConfig = yield selectConfig();
  let {configUrl, ...options} = _options;

  if (accessToken) {
    options = {
      ...options,
      headers: {
        ...(options.headers || {}),
        'x-auth-userid': userId,
        'x-auth-logintoken': accessToken,
        Accept: 'application/json',
      },
    };
  }

  return yield fetch<Data, Form>(config[configUrl] + url, options);
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

  if (status === 401 || status === 403) {
    // @logout
    yield put(profileActions.resetCache());
    yield put(clearUserNonce());
  }
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
}
