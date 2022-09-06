import {Dispatch} from 'react';
import Web3, {Magic, magicGenerator} from 'services/Magic';
import {Contract} from 'web3-eth-contract';
import configs, {BlockchainNetwork, defaultNetwork, NetworkConfig} from 'services/config';
import {put, select, take, takeEvery, call} from 'redux-saga/effects';
import {t} from 'i18next';

import {UserNonceForm} from 'services/types';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';
import {TReduxState, TStoreRedux} from '../../store';
import {TUserNonceSuccessAction, userNonceActions} from '../userNonce/userNonce';
import {selectNetInfo} from '../netInfo/netInfo';
import {profileActions} from '../profile/profile';
import {TUserSignSuccessAction, userSignActions} from '../userSign/userSign';

export type TWeb3 = {
  network: BlockchainNetwork;
  config: NetworkConfig;
  unlocked: boolean;
  accessToken: string;
  userId: string;
  magicToken: string;
  wallet: string;
  loading: boolean;
  magic: Magic;
  web3: Web3;
  treeFactory: Contract;
  planter: Contract;
  planterFund: Contract;
};

const defaultConfig = configs[defaultNetwork];
const defaultMagic = magicGenerator(configs[defaultNetwork]);
const defaultWeb3 = new Web3(magicGenerator(configs[defaultNetwork]).rpcProvider);

export const initialState: TWeb3 = {
  wallet: '',
  accessToken: '',
  magicToken: '',
  userId: '',
  unlocked: false,
  loading: false,
  network: defaultNetwork,
  config: defaultConfig,
  magic: defaultMagic,
  web3: defaultWeb3,
  treeFactory: contractGenerator(defaultWeb3, defaultConfig.contracts.TreeFactory),
  planter: contractGenerator(defaultWeb3, defaultConfig.contracts.Planter),
  planterFund: contractGenerator(defaultWeb3, defaultConfig.contracts.PlanterFund),
};

export type TWeb3Action = {
  type: string;
  updateWeb3: {
    config: NetworkConfig;
    magic: Magic;
    web3: Web3;
    treeFactory: Contract;
    planter: Contract;
    planterFund: Contract;
  };
  updateMagicToken: {
    accessToken: string;
    userId: string;
    wallet: string;
    magicToken: string;
  };
  newNetwork: BlockchainNetwork;
  storeMagicToken: {
    web3: Web3;
    magicToken: string;
    loginData?: UserNonceForm['loginData'];
  };
};

export const CREATE_WEB3 = 'CREATE_WEB3';
export function createWeb3(newNetwork?: BlockchainNetwork) {
  return {
    type: CREATE_WEB3,
    newNetwork,
  };
}

export const CHANGE_NETWORK = 'CHANGE_NETWORK';
export function changeNetwork(newNetwork: BlockchainNetwork) {
  return {type: CHANGE_NETWORK, newNetwork};
}

export const RESET_WEB3_DATA = 'RESET_WEB3_DATA';
export function resetWeb3Data() {
  return {type: RESET_WEB3_DATA};
}

export const UPDATE_WEB3 = 'UPDATE_WEB3';
export function updateWeb3(payload: TWeb3Action['updateWeb3']) {
  return {type: UPDATE_WEB3, updateWeb3: payload};
}

export const UPDATE_WEB3_DONE = 'UPDATE_WEB3_DONE';
export function updateWeb3Done() {
  return {type: UPDATE_WEB3_DONE};
}
export const STORE_MAGIC_TOKEN = 'STORE_MAGIC_TOKEN';
export function storeMagicToken(payload: TWeb3Action['storeMagicToken']) {
  return {type: STORE_MAGIC_TOKEN, storeMagicToken: payload};
}

export const UPDATE_MAGIC_TOKEN = 'UPDATE_MAGIC_TOKEN';
export function updateMagicToken(payload: TWeb3Action['updateMagicToken']) {
  return {type: UPDATE_MAGIC_TOKEN, updateMagicToken: payload};
}
export const NETWORK_DISCONNECT = 'NETWORK_DISCONNECT';
export function networkDisconnect() {
  return {type: NETWORK_DISCONNECT};
}

export const CLEAR_USER_NONCE = 'CLEAR_USER_NONCE';
export function clearUserNonce() {
  return {type: CLEAR_USER_NONCE};
}

export const web3Reducer = (state: TWeb3 = initialState, action: TWeb3Action): TWeb3 => {
  switch (action.type) {
    case CREATE_WEB3: {
      return {
        ...state,
        loading: true,
      };
    }
    case CHANGE_NETWORK: {
      return {
        ...state,
        loading: true,
        network: action.newNetwork,
      };
    }
    case RESET_WEB3_DATA: {
      return {
        ...state,
        unlocked: false,
        accessToken: '',
        wallet: '',
      };
    }
    case UPDATE_WEB3: {
      return {
        ...state,
        ...action.updateWeb3,
        loading: false,
      };
    }
    case UPDATE_WEB3_DONE: {
      return {
        ...state,
        loading: false,
      };
    }
    case STORE_MAGIC_TOKEN: {
      const {loginData, ...storeMagicToken} = action.storeMagicToken;
      return {
        ...state,
        ...storeMagicToken,
        loading: true,
      };
    }
    case UPDATE_MAGIC_TOKEN: {
      return {
        ...state,
        ...action.updateMagicToken,
        unlocked: true,
        loading: false,
      };
    }
    case NETWORK_DISCONNECT: {
      return {
        ...state,
        loading: false,
        unlocked: true,
      };
    }
    case CLEAR_USER_NONCE: {
      return {
        ...state,
        userId: '',
        accessToken: '',
      };
    }
    default: {
      return state;
    }
  }
};

function contractGenerator(web3: Web3, {abi, address}: {abi: any; address: string}): Contract {
  return new web3.eth.Contract(abi, address);
}

export function* watchCreateWeb3({newNetwork}: TWeb3Action) {
  try {
    let config = yield selectConfig();
    if (newNetwork) {
      yield put(resetWeb3Data());
      config = configs[newNetwork];
    }
    const magic: Magic = magicGenerator(config);
    const web3 = new Web3(magic.rpcProvider);
    const treeFactory = contractGenerator(web3, config.contracts.TreeFactory);
    const planter = contractGenerator(web3, config.contracts.Planter);
    const planterFund = contractGenerator(web3, config.contracts.PlanterFund);
    yield put(updateWeb3({config, magic, web3, treeFactory, planter, planterFund}));
  } catch (error) {
    console.log(error, 'update web3 error');
  }
}

export function* watchChangeNetwork(action: TWeb3Action) {
  const {newNetwork} = action;

  try {
    yield put(createWeb3(newNetwork));
  } catch (error) {
    console.log(error, 'update web3 error');
  }
}

export function* watchStoreMagicToken(store, action: TWeb3Action) {
  try {
    const {web3, magicToken, loginData} = action.storeMagicToken;
    const config = yield selectConfig();
    console.log('[[[try]]]');
    let web3Accounts;
    yield web3.eth.getAccounts((e, accounts) => {
      if (e) {
        console.log(e, 'e is here getAccounts eth');
      }
      web3Accounts = accounts;
      console.log(accounts, 'accounts is here');
    });
    if (!web3Accounts) {
      return Promise.reject(new Error('There is no web3 accounts'));
    }
    const wallet = web3Accounts[0];
    const isConnect = yield selectNetInfo();
    if (isConnect) {
      yield put(userNonceActions.load({wallet, magicToken, loginData}));
      const {payload: userNoncePayload}: TUserNonceSuccessAction = yield take(userNonceActions.loadSuccess);

      const signature = yield web3.eth.sign(userNoncePayload.message, wallet);
      console.log(signature, 'signature in web3');
      const response = yield call(() =>
        fetch(`${config.treejerApiUrl}/user/sign?publicAddress=${wallet}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({signature}),
        }),
      );
      const credentials = yield response.json();
      console.log(credentials, 'credentials');

      //? yield put(userSignActions.load({wallet, signature}));
      //? const {payload: credentials}: TUserSignSuccessAction = yield take(userSignActions.loadSuccess);
      //? console.log(credentials, 'credentials in web3');

      web3Accounts = [wallet];

      yield web3.eth.getAccounts(async (error, accounts) => {
        if (error) {
          console.log(error, 'e is here getAccounts eth');
          store.dispatch(networkDisconnect());
          web3Accounts = accounts;
          return;
        }
        const account = web3Accounts[0];
        if (account) {
          store.dispatch(
            updateMagicToken({
              wallet: account,
              accessToken: credentials.loginToken,
              userId: credentials.userId,
              magicToken,
            }),
          );
          store.dispatch(profileActions.load({userId: credentials.userId, accessToken: credentials.loginToken}));
        }
      });
    } else {
      yield put(networkDisconnect());
    }
  } catch (error: any) {
    console.log('[[[[catch]]]]');
    let {error: {message = t('loginFailed.message')} = {}} = error;
    if (error.message) {
      message = error.message;
    }
    yield showSagaAlert({
      title: t('loginFailed.title'),
      message,
      mode: AlertMode.Error,
    });
  }
}

export function* web3Sagas(store: TStoreRedux) {
  yield takeEvery(CHANGE_NETWORK, watchChangeNetwork);
  yield takeEvery(STORE_MAGIC_TOKEN, watchStoreMagicToken, store);
  yield takeEvery(CREATE_WEB3, watchCreateWeb3);
}

export function* selectConfig() {
  return yield select((state: TReduxState) => state.web3.config);
}

export function* selectWallet() {
  return yield select((state: TReduxState) => state.web3.wallet);
}
