import {useCallback, useEffect} from 'react';
import {put, takeEvery} from 'redux-saga/effects';
import Web3 from 'web3';
import {Contract} from 'web3-eth-contract';

import {NetworkConfig} from 'services/config';
import {TTransferFormData} from 'screens/Withdraw/components/TransferForm';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {isWeb} from 'utilities/helpers/web';
import {i18next} from '../../../localization';
import {selectConfig, selectWallet, selectWeb3} from '../web3/web3';

export type TContract = string | number | null;

export type TContracts = {
  dai: TContract | undefined;
  ether: TContract | undefined;
  loading: boolean;
};

type TAction = {
  type: string;
  setBalance: {
    dai?: TContract | undefined;
    ether?: TContract | undefined;
  };
  transaction: TTransferFormData;
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
export function setBalance(payload: TAction['setBalance']) {
  return {type: SET_BALANCE, setBalance: payload};
}

export const RESET_BALANCE = 'RESET_BALANCE';
export function resetBalance() {
  return {type: RESET_BALANCE};
}

export const SUBMIT_TRANSACTION = 'SUBMIT_TRANSACTION';
export function submitTransaction(payload: TAction['transaction']) {
  return {type: SUBMIT_TRANSACTION, transaction: payload};
}

export function contractsReducer(state: TContracts = initialState, action: TAction): TContracts {
  switch (action.type) {
    case GET_BALANCE: {
      return {...state, loading: true};
    }
    case SET_BALANCE: {
      console.log(action, 'action is hreee');
      return {
        ...state,
        ...action.setBalance,
        loading: false,
      };
    }
    case SUBMIT_TRANSACTION: {
      return {...state, loading: true};
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
    const daiContract = new web3.eth.Contract(contract.abi as any, contract.address);

    const daiBalance = yield daiContract.methods.balanceOf(wallet).call();
    const etherBalance = yield web3.eth.getBalance(wallet);

    const contracts: TAction['setBalance'] = {
      dai: web3.utils.fromWei(daiBalance),
      ether: web3.utils.fromWei(etherBalance),
    };

    console.log(contracts, 'datais hreee');

    yield put(setBalance(contracts));
  } catch (e: any) {
    console.log(e, 'error is here');
  }
}

export function asyncTransferDai(daiContract: Contract, from: string, to: string, amount: string) {
  return new Promise((resolve, reject) => {
    daiContract.methods.transfer(to, amount).send({from}, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
}

export function* watchTransaction({transaction}: TAction) {
  try {
    const {amount, userWallet, goalWallet} = transaction;
    const config: NetworkConfig = yield selectConfig();
    const web3: Web3 = yield selectWeb3();
    const contract = config.contracts.Dai;
    const daiContract = new web3.eth.Contract(contract.abi as any, contract.address);
    const amountInEther = web3.utils.toWei(amount, 'ether');
    yield asyncTransferDai(daiContract, userWallet, goalWallet, amountInEther);
    yield put(getBalance());
    showAlert({
      title: i18next.t('transfer.success.title'),
      message: isWeb() ? i18next.t('transfer.success.title') : '',
      mode: AlertMode.Error,
    });
  } catch (e: any) {
    showAlert({
      title: i18next.t('transfer.error.title'),
      message: e.message,
      mode: AlertMode.Error,
    });
    console.log(e.message, 'error is heree');
  }
}

export function* contractsSagas() {
  yield takeEvery(GET_BALANCE, watchContracts);
  yield takeEvery(SUBMIT_TRANSACTION, watchTransaction);
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
  }, []);

  const dispatchContracts = useCallback(() => {
    dispatch(getBalance());
  }, [dispatch]);

  const dispatchTransaction = useCallback(
    (data: TTransferFormData) => {
      dispatch(submitTransaction(data));
    },
    [dispatch],
  );

  return {
    ...contracts,
    getBalance: dispatchContracts,
    submitTransaction: dispatchTransaction,
  };
}
