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
  fee: string | number | null;
  loading: boolean;
  submitting: boolean;
};

type TAction = {
  type: string;
  setBalance: {
    dai?: TContract | undefined;
    ether?: TContract | undefined;
  };
  transaction: TTransferFormData;
  fee: {fee: string | number};
};

const initialState: TContracts = {
  dai: null,
  ether: null,
  fee: null,
  loading: false,
  submitting: false,
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
      return {...state, loading: true, submitting: false};
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
    //
    // const gas = yield web3.eth.estimateGas({from: wallet});
    // console.log('Gas estimated', gas);
    //
    // const gasPrice = yield web3.eth.getGasPrice();

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
    const {amount, from, to} = transaction;
    const config: NetworkConfig = yield selectConfig();
    const web3: Web3 = yield selectWeb3();
    const contract = config.contracts.Dai;
    const daiContract = new web3.eth.Contract(contract.abi as any, contract.address);
    const amountInEther = web3.utils.toWei(amount, 'ether');
    yield asyncTransferDai(daiContract, from, to, amountInEther);
    yield put(cancelTransaction());
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

export function* watchEstimateGasPrice({transaction}: TAction) {
  try {
    const {amount, from, to} = transaction;
    console.log(transaction, 'dataaaaaa');
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
      showAlert({
        title: i18next.t('transfer.error.fee'),
        message: isWeb() ? i18next.t('transfer.error.fee') : '',
      });
    }
  } catch (e: any) {}
}

export function* contractsSagas() {
  yield takeEvery(GET_BALANCE, watchContracts);
  yield takeEvery(SUBMIT_TRANSACTION, watchTransaction);
  yield takeEvery(ESTIMATE_GAS_PRICE, watchEstimateGasPrice);
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

  const dispatchEstimateGasPrice = useCallback(
    (data: TTransferFormData) => {
      dispatch(estimateGasPrice(data));
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
