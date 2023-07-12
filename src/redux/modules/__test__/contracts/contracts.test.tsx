import assert from 'assert';
import {put, select, takeEvery} from 'redux-saga/effects';

import * as contracts from 'ranger-redux/modules/contracts/contracts';
import {getConfig, getWallet, getWeb3} from 'ranger-redux/modules/web3/web3';
import {mockConfig, mockWeb3, mockWeb3Error} from 'ranger-redux/modules/__test__/contracts/contracts.mock';
import {renderHook} from '@testing-library/react-hooks';
import {useContracts} from 'ranger-redux/modules/contracts/contracts';
import {AllTheProviders} from 'ranger-testUtils/testingLibrary';

describe('contracts actions', () => {
  it('get balance', () => {
    const expectedAction = {
      type: contracts.GET_BALANCE,
    };
    expect(contracts.getBalance()).toEqual(expectedAction);
  });
  it('get balance failed', () => {
    const expectedAction = {
      type: contracts.GET_BALANCE_FAILED,
    };
    expect(contracts.getBalanceFailed()).toEqual(expectedAction);
  });
  it('set balance', () => {
    const expectedAction = {
      type: contracts.SET_BALANCE,
      setBalance: {
        dai: 'dai',
        ether: 'ether',
      },
    };
    expect(
      contracts.setBalance({
        dai: 'dai',
        ether: 'ether',
      }),
    ).toEqual(expectedAction);
  });
  it('reset balance', () => {
    const expectedAction = {
      type: contracts.RESET_BALANCE,
    };
    expect(contracts.resetBalance()).toEqual(expectedAction);
  });
  it('submit transaction', () => {
    const expectedAction = {
      type: contracts.SUBMIT_TRANSACTION,
      transaction: {
        form: {
          from: 'X',
          to: 'Y',
          amount: '2',
        },
      },
    };
    expect(
      contracts.submitTransaction({
        form: {
          from: 'X',
          to: 'Y',
          amount: '2',
        },
      }),
    ).toEqual(expectedAction);
  });
  it('estimate gas price', () => {
    const expectedAction = {
      type: contracts.ESTIMATE_GAS_PRICE,
      transaction: {
        form: {
          from: 'X',
          to: 'Y',
          amount: '2',
        },
      },
    };
    expect(
      contracts.estimateGasPrice({
        form: {
          from: 'X',
          to: 'Y',
          amount: '2',
        },
      }),
    ).toEqual(expectedAction);
  });
  it('transaction fee', () => {
    const expectedAction = {
      type: contracts.TRANSACTION_FEE,
      fee: {fee: 'F'},
    };
    expect(contracts.transactionFee({fee: 'F'})).toEqual(expectedAction);
  });
  it('cancel transaction', () => {
    const expectedAction = {
      type: contracts.CANCEL_TRANSACTION,
    };
    expect(contracts.cancelTransaction()).toEqual(expectedAction);
  });
});

describe('contracts reducer', () => {
  const initialState = {
    dai: '',
    ether: '',
    fee: null,
    loading: false,
    submitting: false,
  };
  it('should return initialState', () => {
    expect(contracts.contractsReducer(initialState, {type: ''} as any)).toEqual(initialState);
  });
  it('should handle GET_BALANCE', () => {
    const expectedState = {
      ...initialState,
      loading: true,
    };
    expect(contracts.contractsReducer(initialState, contracts.getBalance() as any)).toEqual(expectedState);
  });
  it('should handle SET_BALANCE', () => {
    const expectedState = {
      ...initialState,
      loading: false,
      dai: 'DAI',
      ether: 'ETHER',
    };
    expect(contracts.contractsReducer(initialState, contracts.setBalance({dai: 'DAI', ether: 'ETHER'}) as any)).toEqual(
      expectedState,
    );
  });
  it('should handle SUBMIT_TRANSACTION', () => {
    const expectedState = {
      ...initialState,
      submitting: true,
    };
    expect(
      contracts.contractsReducer(
        initialState,
        contracts.submitTransaction({form: {from: 'X', to: 'Y', amount: '2'}}) as any,
      ),
    ).toEqual(expectedState);
  });
  it('should handle ESTIMATE_GAS_PRICE', () => {
    const expectedState = {
      ...initialState,
      fee: null,
      submitting: true,
    };
    expect(
      contracts.contractsReducer(
        initialState,
        contracts.estimateGasPrice({form: {from: 'X', to: 'Y', amount: '2'}}) as any,
      ),
    ).toEqual(expectedState);
  });
  it('should handle TRANSACTION_FEE', () => {
    const expectedState = {
      ...initialState,
      fee: 'F',
    };
    expect(contracts.contractsReducer(initialState, contracts.transactionFee({fee: 'F'}) as any)).toEqual(
      expectedState,
    );
  });
  it('should handle CANCEL_TRANSACTION', () => {
    const expectedState = {
      ...initialState,
      submitting: false,
    };
    expect(contracts.contractsReducer(initialState, contracts.cancelTransaction() as any)).toEqual(expectedState);
  });
  it('should handle GET_BALANCE_FAILED', () => {
    const expectedState = {
      ...initialState,
      loading: false,
    };
    expect(contracts.contractsReducer(initialState, contracts.getBalanceFailed() as any)).toEqual(expectedState);
  });
  it('should handle RESET_BALANCE', () => {
    expect(contracts.contractsReducer(initialState, contracts.resetBalance() as any)).toEqual(initialState);
  });
});

describe('asyncTransferDai', () => {
  it('should transfer successfully', () => {
    expect(
      contracts.asyncTransferDai(mockWeb3.eth.Contract('', '') as any, 'FROM', 'TO', '20', 22, 2),
    ).resolves.toEqual('response is here');
  });
  it('should happen error', () => {
    expect(
      contracts.asyncTransferDai(mockWeb3Error.eth.Contract('', '') as any, 'FROM', 'TO', '20', 22, 2),
    ).rejects.toEqual('error is here');
  });
});

describe('contracts saga functions', () => {
  describe('contracts sagas', () => {
    it('contracts sagas should be defined', () => {
      expect(contracts.contractsSagas).toBeDefined();
    });
    it('contracts sagas should watchers', () => {
      const gen = contracts.contractsSagas();
      assert.deepEqual(gen.next().value, takeEvery(contracts.GET_BALANCE, contracts.watchContracts));
      assert.deepEqual(gen.next().value, takeEvery(contracts.SUBMIT_TRANSACTION, contracts.watchTransaction));
      assert.deepEqual(gen.next().value, takeEvery(contracts.ESTIMATE_GAS_PRICE, contracts.watchEstimateGasPrice));
    });
  });
  describe('watchContacts', () => {
    it('watchContracts should be defined', () => {
      expect(contracts.watchContracts).toBeDefined();
    });
    it('watchContracts success', () => {
      const gen = contracts.watchContracts();
      assert.deepEqual(gen.next().value, select(getConfig));
      //@ts-ignore
      assert.deepEqual(gen.next({...mockConfig}).value, select(getWallet));
      //@ts-ignore
      assert.deepEqual(gen.next({...mockConfig, wallet: 'wallet'}).value, select(getWeb3));
      assert.deepEqual(
        //@ts-ignore
        gen.next({...mockConfig, wallet: 'wallet', ...mockWeb3}).value,
        mockWeb3.eth.Contract('', '').methods.balanceOf('').call(),
      );
      assert.deepEqual(
        //@ts-ignore
        gen.next('22').value,
        mockWeb3.eth.getBalance(''),
      );
      const values = {
        dai: '22',
        ether: '11',
      };
      //@ts-ignore
      assert.deepEqual(gen.next('11').value, put(contracts.setBalance(values)));
    });
    it('watchContracts failure', () => {
      const gen = contracts.watchContracts();
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(gen.throw(error).value, put(contracts.getBalanceFailed()));
      expect(global.toast.show).toHaveBeenCalled();
    });
  });
  describe('watchTransaction', () => {
    it('watchTransaction should be defined', () => {
      expect(contracts.watchTransaction).toBeDefined();
    });
    it('watchTransaction success', () => {
      const gen = contracts.watchTransaction({
        type: contracts.SUBMIT_TRANSACTION,
        transaction: {form: {from: 'X', to: 'Y', amount: '2'}},
      } as any);
      assert.deepEqual(gen.next().value, select(getConfig));
      //@ts-ignore
      assert.deepEqual(gen.next(mockConfig).value, select(getWeb3));
      assert.deepEqual(
        //@ts-ignore
        gen.next(mockWeb3).value,
        mockWeb3.eth.Contract('', '').methods.transfer('Y', mockWeb3.utils.toWei('2')).estimateGas({from: 'X'}),
      );
      //@ts-ignore
      assert.deepEqual(gen.next(22).value, mockWeb3.eth.getGasPrice());
      assert.deepEqual(
        //@ts-ignore

        gen.next(2).value,
        contracts.asyncTransferDai(mockWeb3.eth.Contract('', '') as any, 'X', 'Y', '2', 2, 22),
      );
      assert.deepEqual(gen.next().value, put(contracts.cancelTransaction()));
      assert.deepEqual(gen.next().value, put(contracts.getBalance()));
      gen.next();
      expect(global.toast.show).toHaveBeenCalled();
    });
    it('watchTransaction failure', () => {
      const gen = contracts.watchTransaction({
        type: contracts.SUBMIT_TRANSACTION,
        transaction: {form: {from: 'X', to: 'Y', amount: '2'}},
      } as any);
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(gen.throw(error).value, put(contracts.cancelTransaction()));
      assert.deepEqual(gen.next().value, put(contracts.getBalance()));
      gen.next();
      expect(global.toast.show).toHaveBeenCalled();
    });
  });
  describe('watchEstimateGasPrice', () => {
    it('watchEstimateGasPrice should be defined', () => {
      expect(contracts.watchEstimateGasPrice).toBeDefined();
    });
    it('watchEstimateGasPrice success', () => {
      const gen = contracts.watchEstimateGasPrice({
        type: contracts.ESTIMATE_GAS_PRICE,
        transaction: {form: {from: 'X', to: 'Y', amount: '2'}},
      } as any);
      assert.deepEqual(gen.next().value, select(getConfig));
      //@ts-ignore
      assert.deepEqual(gen.next(mockConfig).value, select(getWeb3));
      assert.deepEqual(
        //@ts-ignore
        gen.next(mockWeb3).value,
        mockWeb3.eth.Contract('', '').methods.transfer('Y', mockWeb3.utils.toWei('2')).estimateGas({from: 'X'}),
      );
      //@ts-ignore
      assert.deepEqual(gen.next(22).value, mockWeb3.eth.getGasPrice());
      //@ts-ignore
      assert.deepEqual(gen.next(11).value, put(contracts.transactionFee({fee: 22 * 11})));
      assert.deepEqual(gen.next().value, undefined);
    });
    it('watchEstimateGasPrice failure, invalid fee', () => {
      const gen = contracts.watchEstimateGasPrice({
        type: contracts.ESTIMATE_GAS_PRICE,
        transaction: {form: {from: 'X', to: 'Y', amount: '2'}},
      } as any);
      assert.deepEqual(gen.next().value, select(getConfig));
      //@ts-ignore
      assert.deepEqual(gen.next(mockConfig).value, select(getWeb3));
      assert.deepEqual(
        //@ts-ignore
        gen.next(mockWeb3).value,
        mockWeb3.eth.Contract('', '').methods.transfer('Y', mockWeb3.utils.toWei('2')).estimateGas({from: 'X'}),
      );
      //@ts-ignore
      assert.deepEqual(gen.next(0).value, mockWeb3.eth.getGasPrice());
      assert.deepEqual(gen.next().value, put(contracts.cancelTransaction()));
      gen.next();
      expect(global.toast.show).toHaveBeenCalled();
    });
    it('watchEstimateGasPrice failure', () => {
      const gen = contracts.watchEstimateGasPrice({
        type: contracts.ESTIMATE_GAS_PRICE,
        transaction: {form: {from: 'X', to: 'Y', amount: '2'}},
      } as any);
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(gen.throw(error).value, put(contracts.cancelTransaction()));
      expect(global.toast.show).toHaveBeenCalled();
    });
  });
});

describe('contracts hook', () => {
  const {result} = renderHook(() => useContracts(), {
    wrapper: props => (
      <AllTheProviders
        {...(props as any)}
        initialState={{contracts: {dai: 'DAI', ether: 'ETHER', fee: null, loading: false, submitting: false}}}
      />
    ),
  });
  it('should return state value', () => {
    expect(result.current.loading).toBe(false);
    expect(result.current.submitting).toBe(false);
    expect(result.current.fee).toBe(null);
    expect(result.current.dai).toBe('DAI');
    expect(result.current.ether).toBe('ETHER');
  });
});
