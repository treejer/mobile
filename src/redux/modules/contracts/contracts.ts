import {useCallback} from 'react';
import BN from 'bn.js';
import Web3 from 'web3';
import {Contract} from 'web3-eth-contract';
import {put, takeEvery} from 'redux-saga/effects';

import {NetworkConfig} from 'services/config';
import {AlertMode} from 'utilities/helpers/alert';
import {web3Error} from 'utilities/helpers/web3Error';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {TTransferFormData} from 'screens/Withdraw/components/TransferForm';
import {selectConfig, selectWallet, selectWeb3} from '../web3/web3';

export type TContract = string | number | null;

export type TContracts = {
  dai: string | BN;
  ether: string | BN;
  fee: string | number | null;
  loading: boolean;
  submitting: boolean;
};

type TAction = {
  type: string;
  setBalance: {
    dai?: string | BN;
    ether?: string | BN;
  };
  transaction: {
    form: TTransferFormData;
  };
  fee: {fee: string | number};
};

export const initialContractsState: TContracts = {
  dai: '',
  ether: '',
  fee: null,
  loading: false,
  submitting: false,
};

export const GET_BALANCE_FAILED = 'GET_BALANCE_FAILED';
export function getBalanceFailed() {
  return {type: GET_BALANCE_FAILED};
}

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

export const ESTIMATE_GAS_PRICE = 'ESTIMATE_GAS_PRICE';
export function estimateGasPrice(payload: TAction['transaction']) {
  return {type: ESTIMATE_GAS_PRICE, transaction: payload};
}

export const TRANSACTION_FEE = 'TRANSACTION_FEE';
export function transactionFee(payload: TAction['fee']) {
  return {type: TRANSACTION_FEE, fee: payload};
}

export const CANCEL_TRANSACTION = 'CANCEL_TRANSACTION';
export function cancelTransaction() {
  return {type: CANCEL_TRANSACTION};
}

export function contractsReducer(state: TContracts = initialContractsState, action: TAction): TContracts {
  switch (action.type) {
    case GET_BALANCE: {
      return {
        ...state,
        loading: true,
        submitting: false,
      };
    }
    case SET_BALANCE: {
      return {
        ...state,
        ...action.setBalance,
        loading: false,
      };
    }
    case SUBMIT_TRANSACTION: {
      return {
        ...state,
        submitting: true,
      };
    }
    case ESTIMATE_GAS_PRICE: {
      return {
        ...state,
        fee: null,
        submitting: true,
      };
    }
    case TRANSACTION_FEE: {
      return {
        ...state,
        ...action.fee,
      };
    }
    case CANCEL_TRANSACTION: {
      return {
        ...state,
        submitting: false,
      };
    }
    case GET_BALANCE_FAILED: {
      return {
        ...state,
        loading: false,
      };
    }
    case RESET_BALANCE: {
      return initialContractsState;
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
      dai: daiBalance,
      ether: etherBalance,
    };

    yield put(setBalance(contracts));
  } catch (e: any) {
    toast?.show?.('transfer.error.contractsFailed', {
      type: AlertMode.Error,
      translate: true,
    });
    yield put(getBalanceFailed());
    console.log(e, 'error is here');
  }
}

export function asyncTransferDai(
  daiContract: Contract,
  from: string,
  to: string,
  amount: string,
  gas: number,
  gasPrice: number,
) {
  return new Promise((resolve, reject) => {
    daiContract.methods.transfer(to, amount).send({from, gas, gasPrice}, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    });
  });
}

export function* watchTransaction({transaction}: TAction) {
  const {form} = transaction;
  try {
    const {amount, from, to} = form;

    const config: NetworkConfig = yield selectConfig();
    const web3: Web3 = yield selectWeb3();

    const contract = config.contracts.Dai;

    const daiContract = new web3.eth.Contract(contract.abi as any, contract.address);
    const amountInEther = web3.utils.toWei(amount.toString(), 'ether');

    const estimatedGas = yield daiContract.methods.transfer(to, Web3.utils.toWei(`${amount}`)).estimateGas({from});
    const gasPrice = yield web3.eth.getGasPrice();

    yield asyncTransferDai(daiContract, from, to, amountInEther, estimatedGas, gasPrice);
    yield put(cancelTransaction());
    yield put(getBalance());

    toast?.show?.('transfer.success.title', {type: AlertMode.Success, translate: true});
  } catch (e: any) {
    yield put(cancelTransaction());
    yield put(getBalance());
    toast?.show?.(e.message, {
      type: AlertMode.Error,
    });
  }
}

export function* watchEstimateGasPrice({transaction}: TAction) {
  const {form} = transaction;
  try {
    const {amount, from, to} = form;

    const config: NetworkConfig = yield selectConfig();
    const web3: Web3 = yield selectWeb3();

    const contract = config.contracts.Dai;

    const daiContract = new web3.eth.Contract(contract.abi as any, contract.address);
    const gasAmount = yield daiContract.methods.transfer(to, Web3.utils.toWei(`${amount}`)).estimateGas({from});
    const gasPrice = yield web3.eth.getGasPrice();
    const fee = gasAmount * gasPrice;

    if (fee > 0) {
      yield put(transactionFee({fee}));
    } else {
      yield put(cancelTransaction());
      toast?.show?.('transfer.error.fee', {type: AlertMode.Error, translate: true});
    }
  } catch (e: any) {
    console.log(e.message);
    toast?.show?.(`transfer.error.${web3Error(e).code}`, {type: AlertMode.Error, translate: true});
    yield put(cancelTransaction());
  }
}

export function* contractsSagas() {
  yield takeEvery(GET_BALANCE, watchContracts);
  yield takeEvery(SUBMIT_TRANSACTION, watchTransaction);
  yield takeEvery(ESTIMATE_GAS_PRICE, watchEstimateGasPrice);
}

export function useContracts() {
  const contracts = useAppSelector(state => state.contracts);
  const dispatch = useAppDispatch();

  const dispatchContracts = useCallback(() => {
    dispatch(getBalance());
  }, [dispatch]);

  const dispatchTransaction = useCallback(
    (data: TTransferFormData) => {
      dispatch(submitTransaction({form: data}));
    },
    [dispatch],
  );

  const dispatchEstimateGasPrice = useCallback(
    (data: TTransferFormData) => {
      dispatch(estimateGasPrice({form: data}));
    },
    [dispatch],
  );

  const dispatchCancelTransaction = useCallback(() => {
    dispatch(cancelTransaction());
  }, [dispatch]);

  return {
    ...contracts,
    getBalance: dispatchContracts,
    submitTransaction: dispatchTransaction,
    estimateGasPrice: dispatchEstimateGasPrice,
    cancelTransaction: dispatchCancelTransaction,
  };
}
