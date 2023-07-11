import {useCallback} from 'react';
import Web3, {Magic, magicGenerator} from 'services/Magic';
import {Contract} from 'web3-eth-contract';
import configs, {BlockchainNetwork, ConfigContract, defaultNetwork, NetworkConfig} from 'services/config';
import {put, select, take, takeEvery} from 'redux-saga/effects';
import {Account} from 'web3-core';
import {t} from 'i18next';

import {UserNonceForm} from 'services/types';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {selectNetInfo} from 'ranger-redux/modules/netInfo/netInfo';
import {changeCheckMetaData} from 'ranger-redux/modules/settings/settings';
import {getBalance, resetBalance} from 'ranger-redux/modules/contracts/contracts';
import {profileActions, selectProfile} from 'ranger-redux/modules/profile/profile';
import {TUserSignSuccessAction, userSignActions} from 'ranger-redux/modules/userSign/userSign';
import {TUserNonceSuccessAction, userNonceActions} from 'ranger-redux/modules/userNonce/userNonce';
import {TReduxState, TStoreRedux} from 'ranger-redux/store';

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
const defaultWeb3 = new Web3(magicGenerator(configs[defaultNetwork]).rpcProvider as any);

export const initialWeb3State: TWeb3 = {
  wallet: '',
  accessToken: '',
  magicToken: '',
  userId: '',
  unlocked: false,
  loading: false,
  network: defaultNetwork,
  config: defaultConfig,
  magic: defaultMagic as any,
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

export const web3Reducer = (state: TWeb3 = initialWeb3State, action: TWeb3Action): TWeb3 => {
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
      const {loginData: _loginData, ...newStoreMagicToken} = action.storeMagicToken;

      return {
        ...state,
        ...newStoreMagicToken,
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

function contractGenerator(web3: Web3, {abi, address}: ConfigContract): Contract {
  return new web3.eth.Contract(abi, address);
}

export function* watchCreateWeb3({newNetwork}: TWeb3Action) {
  try {
    let config = yield selectConfig();
    const profile = yield selectProfile();
    const isConnected = yield selectNetInfo();
    if (newNetwork) {
      yield put(resetWeb3Data());
      config = configs[newNetwork];
    }
    const magic: any = magicGenerator(config);
    console.log(magic.rpcProvider, 'magic.rpcProvider');
    const web3 = new Web3(magic.rpcProvider);
    const treeFactory = contractGenerator(web3, config.contracts.TreeFactory);
    const planter = contractGenerator(web3, config.contracts.Planter);
    const planterFund = contractGenerator(web3, config.contracts.PlanterFund);
    yield put(updateWeb3({config, magic, web3, treeFactory, planter, planterFund}));
    if (config.isMainnet) {
      yield put(changeCheckMetaData(true));
    }
    if (isConnected && profile) {
      yield put(getBalance());
    }
  } catch (error) {
    console.log(error, 'update web3 error');
  }
}

export function* watchChangeNetwork(action: TWeb3Action) {
  try {
    const {newNetwork} = action;
    yield put(createWeb3(newNetwork));
    if (newNetwork === BlockchainNetwork.MaticMain) {
      yield put(changeCheckMetaData(true));
    }
  } catch (error) {
    console.log(error, 'update web3 error');
  }
}

export function asyncGetAccounts(web3: Web3) {
  return new Promise((resolve, reject) => {
    return web3.eth.getAccounts(async (error, accounts) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(accounts);
    });
  });
}

export function* watchStoreMagicToken(store, action: TWeb3Action) {
  try {
    const {web3, magicToken, loginData} = action.storeMagicToken;
    yield put(resetBalance());
    console.log('[[[try]]]');
    const web3Accounts = yield asyncGetAccounts(web3);
    if (!web3Accounts) {
      return Promise.reject(new Error('There is no web3 accounts'));
    }
    const wallet = web3Accounts[0];
    const isConnect = yield selectNetInfo();
    if (isConnect) {
      yield put(userNonceActions.load({wallet, magicToken, loginData}));
      const {payload: userNoncePayload}: TUserNonceSuccessAction = yield take(userNonceActions.loadSuccess);

      const signature = yield web3.eth.sign(userNoncePayload.message, wallet);

      yield put(userSignActions.load({wallet, signature}));
      const {payload: credentials}: TUserSignSuccessAction = yield take(userSignActions.loadSuccess);

      yield put(
        updateMagicToken({
          wallet,
          accessToken: credentials.access_token,
          userId: userNoncePayload.userId,
          magicToken,
        }),
      );
      yield put(profileActions.load());
      yield put(getBalance());
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

export type TUseUserWeb3 = TReduxState['web3'] & {
  changeNetwork: (newNetwork: BlockchainNetwork) => void;
  resetWeb3Data: () => void;
  storeMagicToken: (magicToken: string, loginData?: UserNonceForm['loginData']) => void;
  createWeb3: () => void;
};

export function useUserWeb3(): TUseUserWeb3 {
  const web3 = useAppSelector(state => state.web3);
  const dispatch = useAppDispatch();

  const handleCreateWeb3 = useCallback(() => {
    dispatch(createWeb3());
  }, [dispatch]);

  const handleChangeNetwork = useCallback(
    (newNetwork: BlockchainNetwork) => {
      dispatch(changeNetwork(newNetwork));
    },
    [dispatch],
  );

  const handleResetWeb3Data = useCallback(() => {
    dispatch(resetWeb3Data());
  }, [dispatch]);

  const handleStoreMagicToken = useCallback(
    (magicToken: string, loginData?: UserNonceForm['loginData']) => {
      dispatch(storeMagicToken({web3: web3.web3, magicToken, loginData}));
    },
    [dispatch, web3],
  );

  return {
    ...web3,
    changeNetwork: handleChangeNetwork,
    resetWeb3Data: handleResetWeb3Data,
    storeMagicToken: handleStoreMagicToken,
    createWeb3: handleCreateWeb3,
  };
}

export const useWeb3 = () => useAppSelector(state => state.web3.web3);
export const useConfig = () => useAppSelector(state => state.web3.config);
export const useMagic = () => useAppSelector(state => state.web3.magic);
export const useWalletWeb3 = () => useAppSelector(state => state.web3.web3);
export const useTreeFactory = () => useAppSelector(state => state.web3.treeFactory);
export const usePlanter = () => useAppSelector(state => state.web3.planter);
export const usePlanterFund = () => useAppSelector(state => state.web3.planterFund);

export const useWalletAccount = (): string => {
  return useAppSelector(state => state.web3.wallet);
};
export const useWalletAccountTorus = (): Account | null => {
  const web3 = useWeb3();
  return web3.eth.accounts.wallet.length ? web3.eth.accounts.wallet[0] : null;
};
export const useAccessToken = () => useAppSelector(state => state.web3.accessToken);
export const useUserId = () => useAppSelector(state => state.web3.userId);

export const getConfig = (state: TReduxState) => state.web3.config;
export function* selectConfig() {
  return yield select(getConfig);
}

export const getAccessToken = (state: TReduxState) => state.web3.accessToken;
export function* selectAccessToken() {
  return yield select(getAccessToken);
}
export const getWeb3 = (state: TReduxState) => state.web3.web3;
export function* selectWeb3() {
  return yield select(getWeb3);
}

export const getMagic = (state: TReduxState) => state.web3.magic;

export function* selectMagic() {
  return yield select(getMagic);
}

export const getWallet = (state: TReduxState) => state.web3.wallet;
export function* selectWallet() {
  return yield select(getWallet);
}
