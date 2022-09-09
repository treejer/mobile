import {useCallback, useEffect} from 'react';
import {put, takeEvery} from 'redux-saga/effects';
import Web3 from 'web3';

import {NetworkConfig} from 'services/config';
import {handleSagaFetchError} from 'utilities/helpers/fetch';
import {selectConfig, selectWallet, selectWeb3} from '../web3/web3';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';

export type TContract = string | number | null;

export type TContracts = {
  dai: TContract | undefined;
  ether: TContract | undefined;
  loading: boolean;
};

type TAction = {
  type: string;
  payload: {dai: TContract | undefined; ether: TContract | undefined};
};

const initialState: TContracts = {
  dai: null,
  ether: null,
  loading: false,
};

export const GET_BALANCE = 'GET_BALANCE';
export function getBalance() {
  return {type: GET_BALANCE};
}

export const SET_BALANCE = 'SET_BALANCE';
export function setBalance(payload: TAction['payload']) {
  return {type: SET_BALANCE, payload};
}

export const RESET_BALANCE = 'RESET_BALANCE';
export function resetBalance() {
  return {type: RESET_BALANCE};
}

export function contractsReducer(state: TContracts = initialState, action: TAction): TContracts {
  switch (action.type) {
    case GET_BALANCE: {
      return {...state, loading: true};
    }
    case SET_BALANCE: {
      return {...action.payload, loading: false};
    }
    case RESET_BALANCE: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

export function* watchContracts() {
  try {
    const config: NetworkConfig = yield selectConfig();
    const wallet: string = yield selectWallet();
    const web3: Web3 = yield selectWeb3();
    const contract = config.contracts.Dai;
    const ethContract = new web3.eth.Contract(contract.abi as any, contract.address);
    const walletBalance = yield ethContract.methods.balanceOf(wallet).call();
    const balance = yield web3.eth.getBalance(wallet);
    const contracts: Omit<TContracts, 'loading'> = {
      dai: web3.utils.fromWei(walletBalance),
      ether: web3.utils.fromWei(balance),
    };
    yield put(setBalance(contracts));
  } catch (e: any) {
    yield handleSagaFetchError(e);
  }
}

export function* contractsSagas() {
  yield takeEvery(GET_BALANCE, watchContracts);
}

export type TUseContracts = {didMount?: boolean};

export function useContracts({didMount}: TUseContracts = {}) {
  const contracts = useAppSelector(state => state.contracts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (didMount) {
      console.log('fetched');
      dispatch(getBalance());
    }
  }, [dispatch]);

  const dispatchContracts = useCallback(() => {
    dispatch(getBalance());
  }, [dispatch]);

  return {
    ...contracts,
    getBalance: dispatchContracts,
  };
}
