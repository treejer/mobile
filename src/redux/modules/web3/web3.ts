import Web3, {Magic, magicGenerator} from 'services/Magic';
import {Contract} from 'web3-eth-contract';
import configs, {BlockchainNetwork, defaultNetwork, NetworkConfig} from 'services/config';
import {put, select, take, takeEvery} from 'redux-saga/effects';
import {t} from 'i18next';

import {store, TReduxState} from '../../store';
import {TUserNonceAction, TUserNonceSuccessAction, userNonceActions} from '../userNonce/userNonce';
import {userSignActions} from '../userSign/userSign';
import {selectNetInfo} from '../netInfo/netInfo';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';

// ? UpdateAccessToken

// export interface Web3ContextState {
//   web3: Web3;
//   unlocked: boolean;
//   accessToken: string;
//   treeFactory: Contract;
//   planter: Contract;
//   planterFund: Contract;
//   resetWeb3Data: () => void;
//   userId: string;
//   magicToken: string;
//   storeMagicToken: (token: string) => void;
//   wallet: string;
//   loading: boolean;
//   network: BlockchainNetwork;
//   magic: Magic | null;
//   changeNetwork: (network: BlockchainNetwork) => void;
//   config: NetworkConfig;
// }

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
//   resetWeb3Data: () => void;
//   storeMagicToken: (token: string) => void;
//   changeNetwork: (network: BlockchainNetwork) => void;

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
  };
  newNetwork: BlockchainNetwork;
  storeMagicToken: {
    web3: Web3;
    magicToken: string;
  };
};

export const CHANGE_NETWORK = 'CHANGE_NETWORK';
export function changeNetwork(newNetwork: string) {
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
export function storeMagicToken(payload: {web3: Web3; magicToken: string}) {
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

export const web3Reducer = (state: TWeb3 = initialState, action: TWeb3Action): TWeb3 => {
  switch (action.type) {
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
      return {
        ...state,
        ...action.storeMagicToken,
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
    default: {
      return state;
    }
  }
};

function contractGenerator(web3: Web3, {abi, address}: {abi: any; address: string}): Contract {
  return new web3.eth.Contract(abi, address);
}

export function* watchChangeNetwork(action: TWeb3Action) {
  const {newNetwork} = action;

  try {
    const config = configs[newNetwork];
    const magic: Magic = magicGenerator(config);
    const web3 = new Web3(magic.rpcProvider);
    const treeFactory = contractGenerator(web3, config.contracts.TreeFactory);
    const planter = contractGenerator(web3, config.contracts.Planter);
    const planterFund = contractGenerator(web3, config.contracts.PlanterFund);
    console.log('====================================');
    console.log({config, magic, web3, treeFactory, planter, planterFund});
    console.log('====================================');

    yield put(updateWeb3({config, magic, web3, treeFactory, planter, planterFund}));
  } catch (error) {
    console.log(error, 'update web3 error');
  }
}

export function* watchStoreMagicToken(action: TWeb3Action) {
  const {web3, magicToken} = action.storeMagicToken;
  try {
    console.log('[[[try]]]');
    console.log('====================================');
    console.log({web3, magicToken});
    console.log('====================================');
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
    // const isConnect = yield selectNetInfo();
    // if (isConnect) {
    yield put(userNonceActions.load({wallet}));
    const {payload}: TUserNonceSuccessAction = yield take(userNonceActions.loadSuccess);

    const signature = yield web3.eth.sign(payload.message, wallet);
    console.log('====================================');
    console.log(signature, 'signature is hereeeee');
    console.log('====================================');
    yield put(userSignActions.load({wallet, signature}));
    const credentials = yield take(userSignActions.loadSuccess);
    console.log('====================================');
    console.log(credentials, 'credentials is here');
    console.log('====================================');
    // let web3Accounts = [credentials.wallet];

    // yield web3.eth.getAccounts(async (error, accounts) => {
    //   if (error) {
    //     console.log(error, 'e is here getAccounts eth');
    //     store.dispatch(networkDisconnect());
    //     web3Accounts = accounts;
    //     return;
    //   }
    //   const account = web3Accounts[0];
    //   if (account) {
    //     store.dispatch(
    //       updateMagicToken({wallet: account, accessToken: credentials.accessToken, userId: credentials.userId}),
    //     );
    //   }
    // });
    // }
    //  else {
    //   yield put(networkDisconnect());
    // }
  } catch (error: any) {
    console.log('[[[[catch]]]]');
    let {error: {message = t('loginFailed.message')} = {}} = error;
    if (error.message) {
      message = error.message;
    }
    showSagaAlert({
      title: t('loginFailed.title'),
      message,
      mode: AlertMode.Error,
    });
  }
}

export function* web3Sagas() {
  yield takeEvery(CHANGE_NETWORK, watchChangeNetwork);
  yield takeEvery(STORE_MAGIC_TOKEN, watchStoreMagicToken);
}

export function* selectConfig() {
  return yield select((state: TReduxState) => state.web3.config);
}

export function* selectWallet() {
  return yield select((state: TReduxState) => state.web3.wallet);
}
