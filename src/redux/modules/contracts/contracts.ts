import {useCallback} from 'react';
import BN from 'bn.js';
import Web3 from 'web3';
import {Contract} from 'web3-eth-contract';
import {put, takeEvery} from 'redux-saga/effects';
import {useToast} from 'react-native-toast-notifications';
import {ToastOptions} from 'react-native-toast-notifications/lib/typescript/toast';

import {NetworkConfig} from 'services/config';
import {AlertMode} from 'utilities/helpers/alert';
import {web3Error} from 'utilities/helpers/web3Error';
import {useAppDispatch, useAppSelector} from 'utilities/hooks/useStore';
import {selectConfig, selectWallet, selectWeb3} from '../web3/web3';
import {i18next} from '../../../localization';
import {TTransferFormData} from 'screens/Withdraw/components/TransferForm';

export type TContract = string | number | null;

export type TShow = (message: string | JSX.Element, toastOptions?: ToastOptions | undefined) => string;

export type TContracts = {
  dai: string | BN;
  ether: string | BN;
  fee: string | number | null;
  loading: boolean;
  submitting: boolean;
};

type TAction = {
  type: string;
  getBalance?: {
    show?: TShow;
  };
  setBalance: {
    dai?: string | BN;
    ether?: string | BN;
    show?: TShow;
  };
  transaction: {
    form: TTransferFormData;
    show: TShow;
  };
  fee: {fee: string | number; show?: TShow};
};

const initialState: TContracts = {
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
export function getBalance(payload?: TAction['getBalance']) {
  return {type: GET_BALANCE, getBalance: payload};
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

export function contractsReducer(state: TContracts = initialState, action: TAction): TContracts {
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
      return initialState;
    }
    default: {
      return state;
    }
  }
}

export function* watchContracts({getBalance}: TAction) {
  const show = getBalance?.show;
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
    toast?.show?.(i18next.t('transfer.error.contractsFailed'), {
      type: AlertMode.Error,
    });
    yield put(getBalanceFailed());
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
  const {show, form} = transaction;
  try {
    const {amount, from, to} = form;

    const config: NetworkConfig = yield selectConfig();
    const web3: Web3 = yield selectWeb3();

    const contract = config.contracts.Dai;

    const daiContract = new web3.eth.Contract(contract.abi as any, contract.address);
    const amountInEther = web3.utils.toWei(amount.toString(), 'ether');

    yield asyncTransferDai(daiContract, from, to, amountInEther);
    yield put(cancelTransaction());
    yield put(getBalance());

    toast.show(i18next.t('transfer.success.title'), {type: AlertMode.Success});
  } catch (e: any) {
    yield put(cancelTransaction());
    yield put(getBalance());
    toast.show?.(e.message, {
      type: AlertMode.Error,
    });
  }
}

export function* watchEstimateGasPrice({transaction}: TAction) {
  const {show, form} = transaction;
  try {
    const {amount, from, to} = form;

    const config: NetworkConfig = yield selectConfig();
    const web3: Web3 = yield selectWeb3();

    const contract = config.contracts.Dai;

    const daiContract = new web3.eth.Contract(contract.abi as any, contract.address);
    const gasAmount = yield daiContract.methods.transfer(to, Web3.utils.toWei(`${amount}`)).estimateGas({from});
    const gasPrice = yield web3.eth.getGasPrice();
    const fee = gasAmount * gasPrice;

    console.log(fee, 'feeeeeeeeeee');
    if (fee > 0) {
      yield put(transactionFee({fee}));
    } else {
      yield put(cancelTransaction());
      toast.show?.(i18next.t('transfer.error.fee'), {type: AlertMode.Error});
    }
  } catch (e: any) {
    console.log(e.message);
    toast.show?.(i18next.t(`transfer.error.${web3Error(e).code}`), {type: AlertMode.Error});
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
  const {show} = useToast();

  const dispatchContracts = useCallback(() => {
    dispatch(getBalance({show}));
  }, [dispatch]);

  const dispatchTransaction = useCallback(
    (data: TTransferFormData) => {
      dispatch(submitTransaction({form: data, show}));
    },
    [dispatch],
  );

  const dispatchEstimateGasPrice = useCallback(
    (data: TTransferFormData) => {
      dispatch(estimateGasPrice({form: data, show}));
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
