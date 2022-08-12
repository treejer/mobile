import Web3, {Magic, magicGenerator} from 'services/Magic';
import {Contract} from 'web3-eth-contract';
import configs, {BlockchainNetwork, defaultNetwork, NetworkConfig} from 'services/config';
import {put, select, take, takeEvery} from 'redux-saga/effects';
import {TReduxState} from 'redux/store';
import {userNonceActions} from 'redux/modules/userNonce/userNonce';
import {userSignActions} from 'redux/modules/userSign/userSign';
import {selectNetInfo} from 'redux/modules/netInfo/netInfo';

// ? UpdateAccessToken

export interface Web3ContextState {
  web3: Web3;
  unlocked: boolean;
  accessToken: string;
  treeFactory: Contract;
  planter: Contract;
  planterFund: Contract;
  resetWeb3Data: () => void;
  userId: string;
  magicToken: string;
  storeMagicToken: (token: string) => void;
  wallet: string;
  loading: boolean;
  network: BlockchainNetwork;
  magic: Magic | null;
  changeNetwork: (network: BlockchainNetwork) => void;
  config: NetworkConfig;
}

export type TWeb3 = {
  network: BlockchainNetwork;
  config: NetworkConfig;
  unlocked: boolean;
  accessToken: string;
  //   resetWeb3Data: () => void;
  userId: string;
  magicToken: string;
  //   storeMagicToken: (token: string) => void;
  wallet: string;
  loading: boolean;
  magic: Magic;
  web3: Web3;
  treeFactory: Contract;
  planter: Contract;
  planterFund: Contract;
  //   changeNetwork: (network: BlockchainNetwork) => void;
};

const defaultConfig = configs[defaultNetwork];
const defaultMagic = magicGenerator(configs[defaultNetwork]);
const defaultWeb3 = new Web3(magicGenerator(configs[defaultNetwork]).rpcProvider);

export const initialState: TWeb3 = {
  network: defaultNetwork,
  config: defaultConfig,
  magic: defaultMagic,
  web3: defaultWeb3,
  treeFactory: contractGenerator(defaultWeb3, defaultConfig.contracts.TreeFactory),
  planter: contractGenerator(defaultWeb3, defaultConfig.contracts.Planter),
  planterFund: contractGenerator(defaultWeb3, defaultConfig.contracts.PlanterFund),
  wallet: '',
  accessToken: '',
  magicToken: '',
  userId: '',
  unlocked: false,
  loading: true,
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
  newNetwork: BlockchainNetwork;
  web3: Web3;
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

export const STORE_MAGIC_TOKEN = 'STORE_MAGIC_TOKEN';
export function storeMagicToken(web3: Web3) {
  return {type: STORE_MAGIC_TOKEN, web3};
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
        loading: false,
        ...action.updateWeb3,
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
        web3: action.web3,
        loading: true,
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

    yield put(updateWeb3({config, magic, web3, treeFactory, planter, planterFund}));
  } catch (error) {
    console.log(error, 'update web3 error');
  }
}

export function* watchStoreMagicToken(action: TWeb3Action) {
  const {web3} = action;
  try {
    const wallet = yield selectWallet();
    const isConnect = yield selectNetInfo();
    if (isConnect) {
      yield put(userNonceActions.load());
      const userNonceResult = yield take(userNonceActions.loadSuccess);
      const signature = yield web3.eth.sign(userNonceResult.message, wallet);

      //! pass signature to userSign

      yield put(userSignActions.load({signature}));
    } else {
      yield put(networkDisconnect());
    }
  } catch (error) {}
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
