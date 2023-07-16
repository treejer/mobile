import assert from 'assert';
import {put, select, take, takeEvery} from 'redux-saga/effects';
import {act, renderHook} from '@testing-library/react-hooks';

import Web3, {magicGenerator} from 'services/Magic';
import config, {BlockchainNetwork} from 'services/config';
import {AlertMode, showSagaAlert} from 'utilities/helpers/alert';
import * as storeHook from 'utilities/hooks/useStore';
import {
  mockConfig,
  mockWeb3,
  mockWeb3AccountsError,
  mockWeb3Error,
} from 'ranger-redux/modules/__test__/contracts/contracts.mock';
import {getProfile, profileActions} from 'ranger-redux/modules/profile/profile';
import {getNetInfo} from 'ranger-redux/modules/netInfo/netInfo';
import {mockProfile} from 'ranger-redux/modules/__test__/currentJourney/currentJourney.mock';
import {getBalance, resetBalance} from 'ranger-redux/modules/contracts/contracts';
import {changeCheckMetaData} from 'ranger-redux/modules/settings/settings';
import {userNonceActions, userNonceActionTypes} from 'ranger-redux/modules/userNonce/userNonce';
import {userSignActions, userSignActionTypes} from 'ranger-redux/modules/userSign/userSign';
import {AllTheProviders} from 'ranger-testUtils/testingLibrary';
import * as web3 from 'ranger-redux/modules/web3/web3';

describe('web3 actions', () => {
  it('create web3', () => {
    const expectedAction = {
      type: web3.CREATE_WEB3,
      newNetwork: BlockchainNetwork.Goerli,
    };
    expect(web3.createWeb3(BlockchainNetwork.Goerli)).toEqual(expectedAction);
  });
  it('create default web3', () => {
    const expectedAction = {
      type: web3.CREATE_WEB3,
    };
    expect(web3.createWeb3()).toEqual(expectedAction);
  });
  it('change network', () => {
    const expectedAction = {
      type: web3.CHANGE_NETWORK,
      newNetwork: BlockchainNetwork.Goerli,
    };
    expect(web3.changeNetwork(BlockchainNetwork.Goerli)).toEqual(expectedAction);
  });
  it('reset web3 data', () => {
    const expectedAction = {
      type: web3.RESET_WEB3_DATA,
    };
    expect(web3.resetWeb3Data()).toEqual(expectedAction);
  });
  it('update web3', () => {
    const updateWeb3 = {
      config: web3.defaultConfig,
      magic: web3.defaultMagic as any,
      web3: web3.defaultWeb3,
      treeFactory: web3.contractGenerator(web3.defaultWeb3, web3.defaultConfig.contracts.TreeFactory),
      planter: web3.contractGenerator(web3.defaultWeb3, web3.defaultConfig.contracts.Planter),
      planterFund: web3.contractGenerator(web3.defaultWeb3, web3.defaultConfig.contracts.PlanterFund),
    };
    const expectedAction = {
      type: web3.UPDATE_WEB3,
      updateWeb3,
    };
    expect(web3.updateWeb3(updateWeb3)).toEqual(expectedAction);
  });
  it('update web3 done', () => {
    const expectedAction = {
      type: web3.UPDATE_WEB3_DONE,
    };
    expect(web3.updateWeb3Done()).toEqual(expectedAction);
  });
  it('store magic token', () => {
    const storeMagicToken = {
      web3: web3.defaultWeb3,
      magicToken: 'TOKEN',
    };
    const expectedAction = {
      type: web3.STORE_MAGIC_TOKEN,
      storeMagicToken,
    };
    expect(web3.storeMagicToken(storeMagicToken)).toEqual(expectedAction);
  });
  it('store magic token with login data', () => {
    const storeMagicToken = {
      web3: web3.defaultWeb3,
      magicToken: 'TOKEN',
      loginData: {
        mobile: 'MOBILE',
        country: 'COUNTRY',
      },
    };
    const expectedAction = {
      type: web3.STORE_MAGIC_TOKEN,
      storeMagicToken,
    };
    expect(web3.storeMagicToken(storeMagicToken)).toEqual(expectedAction);
  });
  it('update magic token', () => {
    const updateMagicToken = {
      accessToken: 'TOKEN',
      userId: 'USERID',
      wallet: 'WALLET',
      magicToken: 'TOKEN',
    };
    const expectedAction = {
      type: web3.UPDATE_MAGIC_TOKEN,
      updateMagicToken,
    };
    expect(web3.updateMagicToken(updateMagicToken)).toEqual(expectedAction);
  });
  it('network disconnect', () => {
    const expectedAction = {
      type: web3.NETWORK_DISCONNECT,
    };
    expect(web3.networkDisconnect()).toEqual(expectedAction);
  });
  it('clear user nonce', () => {
    const expectedAction = {
      type: web3.CLEAR_USER_NONCE,
    };
    expect(web3.clearUserNonce()).toEqual(expectedAction);
  });
});

describe('web3 reducer', () => {
  it('should return initialState', () => {
    expect(web3.web3Reducer(web3.initialWeb3State, {type: ''} as any)).toEqual(web3.initialWeb3State);
  });
  it('should handle CREATE_WEB3', () => {
    const expectedState = {
      ...web3.initialWeb3State,
      loading: true,
    };
    expect(web3.web3Reducer(web3.initialWeb3State, web3.createWeb3() as any)).toEqual(expectedState);
  });
  it('should handle CHANGE_NETWORK', () => {
    const expectedState = {
      ...web3.initialWeb3State,
      loading: true,
      network: BlockchainNetwork.Goerli,
    };
    expect(web3.web3Reducer(web3.initialWeb3State, web3.changeNetwork(BlockchainNetwork.Goerli) as any)).toEqual(
      expectedState,
    );
  });
  it('should handle RESET_WEB_DATA', () => {
    const expectedState = {
      ...web3.initialWeb3State,
      unlocked: false,
      accessToken: '',
      wallet: '',
    };
    expect(web3.web3Reducer(web3.initialWeb3State, web3.resetWeb3Data() as any)).toEqual(expectedState);
  });
  it('should handle UPDATE_WEB3', () => {
    const payload = {
      config: web3.defaultConfig,
      magic: web3.defaultMagic as any,
      web3: web3.defaultWeb3,
      treeFactory: web3.contractGenerator(web3.defaultWeb3, web3.defaultConfig.contracts.TreeFactory),
      planter: web3.contractGenerator(web3.defaultWeb3, web3.defaultConfig.contracts.Planter),
      planterFund: web3.contractGenerator(web3.defaultWeb3, web3.defaultConfig.contracts.PlanterFund),
    };
    const expectedState = {
      ...web3.initialWeb3State,
      loading: false,
    };
    expect(web3.web3Reducer(web3.initialWeb3State, web3.updateWeb3(payload) as any)).toEqual(expectedState);
  });
  it('should handle UPDATE_WEB3_DONE', () => {
    const expectedState = {
      ...web3.initialWeb3State,
      loading: false,
    };
    expect(web3.web3Reducer(web3.initialWeb3State, web3.updateWeb3Done() as any)).toEqual(expectedState);
  });
  it('should handle STORE_MAGIC_TOKEN', () => {
    const payload = {
      web3: web3.defaultWeb3,
      magicToken: 'TOKEN',
    };
    const expectedState = {
      ...web3.initialWeb3State,
      ...payload,
      loading: true,
    };
    expect(web3.web3Reducer(web3.initialWeb3State, web3.storeMagicToken(payload) as any)).toEqual(expectedState);
  });
  it('should handle UPDATE_MAGIC_TOKEN', () => {
    const payload = {
      accessToken: 'TOKEN',
      userId: 'ID',
      wallet: 'WALLET',
      magicToken: 'TOKEN',
    };
    const expectedState = {
      ...web3.initialWeb3State,
      ...payload,
      unlocked: true,
      loading: false,
    };
    expect(web3.web3Reducer(web3.initialWeb3State, web3.updateMagicToken(payload) as any)).toEqual(expectedState);
  });
  it('should handle NETWORK_DISCONNECT', () => {
    const expectedState = {
      ...web3.initialWeb3State,
      loading: false,
      unlocked: true,
    };
    expect(web3.web3Reducer(web3.initialWeb3State, web3.networkDisconnect() as any)).toEqual(expectedState);
  });
  it('should handle CLEAR_USER_NONCE', () => {
    const expectedState = {
      ...web3.initialWeb3State,
      userId: '',
      accessToken: '',
    };
    expect(web3.web3Reducer(web3.initialWeb3State, web3.clearUserNonce() as any)).toEqual(expectedState);
  });
});

describe('web3 contractGenerator', () => {
  it('should create contract', () => {
    const spy = jest.spyOn(mockWeb3.eth, 'Contract');
    const isPlaying = web3.contractGenerator(mockWeb3 as any, {abi: 'ABI', address: 'ADDRESS'} as any);
    expect(isPlaying).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });
});

describe('web3 asyncGetAccounts', () => {
  it('should get account success', () => {
    expect(web3.asyncGetAccounts(mockWeb3 as any)).resolves.toEqual(['WALLET']);
  });
  it('should get account failure', () => {
    expect(web3.asyncGetAccounts(mockWeb3Error as any)).rejects.toBe('error is here!');
  });
});

describe('web3 saga functions', () => {
  describe('web3 sagas', () => {
    it('web3 sagas should be defined', () => {
      expect(web3.web3Sagas).toBeDefined();
    });
    it('web3 sagas should yield watchers', () => {
      const dispatch = (action: () => {}) => {};
      const gen = web3.web3Sagas();
      assert.deepEqual(gen.next().value, takeEvery(web3.CHANGE_NETWORK, web3.watchChangeNetwork));
      assert.deepEqual(gen.next().value, takeEvery(web3.STORE_MAGIC_TOKEN, web3.watchStoreMagicToken));
      assert.deepEqual(gen.next().value, takeEvery(web3.CREATE_WEB3, web3.watchCreateWeb3));
    });
  });
  describe('watchCreateWeb3', () => {
    it('watchCreateWeb3 should be defined', () => {
      expect(web3.watchCreateWeb3).toBeDefined();
    });
    it('watchCreateWeb3 newNetwork success', () => {
      jest.mock('web3', () => (a: any) => mockWeb3);
      const gen = web3.watchCreateWeb3({newNetwork: BlockchainNetwork.Goerli} as any);

      assert.deepEqual(gen.next().value, select(web3.getConfig));
      assert.deepEqual(gen.next(mockConfig).value, select(getProfile));
      assert.deepEqual(gen.next(mockProfile).value, select(getNetInfo));
      assert.deepEqual(gen.next(true).value, put(web3.resetWeb3Data()));

      // @ts-ignore
      const magic: any = magicGenerator(mockConfig);
      const newWeb3 = new Web3(magic.rpcProvider);
      console.log(newWeb3);
      const treeFactory = web3.contractGenerator(newWeb3, config[BlockchainNetwork.Goerli].contracts.TreeFactory);
      const planter = web3.contractGenerator(newWeb3, config[BlockchainNetwork.Goerli].contracts.Planter);
      const planterFund = web3.contractGenerator(newWeb3, config[BlockchainNetwork.Goerli].contracts.PlanterFund);
      assert.deepEqual(
        JSON.stringify(gen.next().value),
        JSON.stringify(
          put(
            web3.updateWeb3({
              config: config[BlockchainNetwork.Goerli],
              magic,
              web3: newWeb3,
              treeFactory,
              planter,
              planterFund,
            }),
          ),
        ),
      );
      assert.deepEqual(gen.next().value, put(getBalance()));
    });
    it('watchCreateWeb3 mainnet success', () => {
      jest.mock('web3', () => (a: any) => mockWeb3);
      const gen = web3.watchCreateWeb3({} as any);

      const mainnetMockConfig = {
        ...mockConfig,
        isMainnet: true,
      };

      assert.deepEqual(gen.next().value, select(web3.getConfig));
      assert.deepEqual(gen.next(mainnetMockConfig).value, select(getProfile));
      assert.deepEqual(gen.next(mockProfile).value, select(getNetInfo));

      // @ts-ignore
      const magic: any = magicGenerator(mainnetMockConfig);
      const newWeb3 = new Web3(magic.rpcProvider);
      const treeFactory = web3.contractGenerator(newWeb3, mainnetMockConfig.contracts.TreeFactory);
      const planter = web3.contractGenerator(newWeb3, mainnetMockConfig.contracts.Planter);
      const planterFund = web3.contractGenerator(newWeb3, mainnetMockConfig.contracts.PlanterFund);
      assert.deepEqual(
        JSON.stringify(gen.next(true).value),
        JSON.stringify(
          put(
            web3.updateWeb3({
              config: mainnetMockConfig as any,
              magic,
              web3: newWeb3,
              treeFactory,
              planter,
              planterFund,
            }),
          ),
        ),
      );
      assert.deepEqual(gen.next().value, put(changeCheckMetaData(true)));
      assert.deepEqual(gen.next().value, put(getBalance()));
    });
    it('watchCreateWeb3 not connected success', () => {
      jest.mock('web3', () => (a: any) => mockWeb3);
      const gen = web3.watchCreateWeb3({} as any);

      const mainnetMockConfig = {
        ...mockConfig,
        isMainnet: true,
      };

      assert.deepEqual(gen.next().value, select(web3.getConfig));
      assert.deepEqual(gen.next(mainnetMockConfig).value, select(getProfile));
      assert.deepEqual(gen.next(mockProfile).value, select(getNetInfo));

      // @ts-ignore
      const magic: any = magicGenerator(mainnetMockConfig);
      const newWeb3 = new Web3(magic.rpcProvider);
      const treeFactory = web3.contractGenerator(newWeb3, mainnetMockConfig.contracts.TreeFactory);
      const planter = web3.contractGenerator(newWeb3, mainnetMockConfig.contracts.Planter);
      const planterFund = web3.contractGenerator(newWeb3, mainnetMockConfig.contracts.PlanterFund);
      assert.deepEqual(
        JSON.stringify(gen.next(false).value),
        JSON.stringify(
          put(
            web3.updateWeb3({
              config: mainnetMockConfig as any,
              magic,
              web3: newWeb3,
              treeFactory,
              planter,
              planterFund,
            }),
          ),
        ),
      );
      assert.deepEqual(gen.next().value, put(changeCheckMetaData(true)));
      assert.deepEqual(gen.next().value, undefined);
    });
    it('watchCreateWeb3 logged out success', () => {
      jest.mock('web3', () => (a: any) => mockWeb3);
      const gen = web3.watchCreateWeb3({} as any);

      const mainnetMockConfig = {
        ...mockConfig,
        isMainnet: true,
      };

      assert.deepEqual(gen.next().value, select(web3.getConfig));
      assert.deepEqual(gen.next(mainnetMockConfig).value, select(getProfile));
      assert.deepEqual(gen.next(null).value, select(getNetInfo));

      // @ts-ignore
      const magic: any = magicGenerator(mainnetMockConfig);
      const newWeb3 = new Web3(magic.rpcProvider);
      const treeFactory = web3.contractGenerator(newWeb3, mainnetMockConfig.contracts.TreeFactory);
      const planter = web3.contractGenerator(newWeb3, mainnetMockConfig.contracts.Planter);
      const planterFund = web3.contractGenerator(newWeb3, mainnetMockConfig.contracts.PlanterFund);
      assert.deepEqual(
        JSON.stringify(gen.next(true).value),
        JSON.stringify(
          put(
            web3.updateWeb3({
              config: mainnetMockConfig as any,
              magic,
              web3: newWeb3,
              treeFactory,
              planter,
              planterFund,
            }),
          ),
        ),
      );
      assert.deepEqual(gen.next().value, put(changeCheckMetaData(true)));
      assert.deepEqual(gen.next().value, undefined);
    });
    it('watchCreateWeb3 failure', () => {
      const gen = web3.watchCreateWeb3({} as any);
      const spy = jest.spyOn(console, 'log');
      gen.next();
      const error = new Error('error is here!');
      gen.throw(error);
      gen.next();
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(error, 'create web3 error');
    });
  });
  describe('watchChangeNetwork', () => {
    it('watchChangeNetwork should be defined', () => {
      expect(web3.watchChangeNetwork).toBeDefined();
    });
    it('watchChangeNetwork success', () => {
      const gen = web3.watchChangeNetwork({newNetwork: BlockchainNetwork.Goerli} as any);
      assert.deepEqual(gen.next().value, put(web3.createWeb3(BlockchainNetwork.Goerli)));
    });
    it('watchChangeNetwork failure', () => {
      const gen = web3.watchChangeNetwork({} as any);
      const spy = jest.spyOn(console, 'log');
      gen.next();
      const error = new Error('error is here!');
      gen.throw(error);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(error, 'change network error');
    });
  });
  describe('watchStoreMagicToken', () => {
    it('watchStoreMagicToken should be defined', () => {
      expect(web3.watchStoreMagicToken).toBeDefined();
    });
    it('watchStoreMagicToken success', () => {
      const gen = web3.watchStoreMagicToken({
        storeMagicToken: {web3: mockWeb3, magicToken: 'MAGIC_TOKEN', loginData: {}},
      } as any);
      assert.deepEqual(gen.next().value, put(resetBalance()));
      assert.deepEqual(gen.next().value, web3.asyncGetAccounts(mockWeb3 as any));
      // @ts-ignore
      assert.deepEqual(gen.next(['WALLET']).value, select(getNetInfo));
      assert.deepEqual(
        //@ts-ignore
        gen.next(true).value,
        put(userNonceActions.load({wallet: 'WALLET', magicToken: 'MAGIC_TOKEN', loginData: {}})),
      );
      assert.deepEqual(gen.next().value, take(userNonceActionTypes.loadSuccess));
      assert.deepEqual(
        //@ts-ignore
        gen.next({payload: {message: 'MESSAGE', userId: '', access_token: 'ACCESS_TOKEN'}}).value,
        mockWeb3.eth.sign('MESSAGE', 'WALLET'),
      );
      assert.deepEqual(
        //@ts-ignore
        gen.next('signature').value,
        put(userSignActions.load({wallet: 'WALLET', signature: 'signature'})),
      );
      assert.deepEqual(gen.next().value, take(userSignActionTypes.loadSuccess));
      assert.deepEqual(
        //@ts-ignore
        gen.next({payload: {access_token: 'ACCESS_TOKEN', message: 'MESSAGE', userId: ''}}).value,
        put(
          web3.updateMagicToken({magicToken: 'MAGIC_TOKEN', userId: '', accessToken: 'ACCESS_TOKEN', wallet: 'WALLET'}),
        ),
      );
      assert.deepEqual(gen.next().value, put(profileActions.load()));
      assert.deepEqual(gen.next().value, put(getBalance()));
    });
    it('watchStoreMagicToken failure disconnected', () => {
      const gen = web3.watchStoreMagicToken({
        storeMagicToken: {web3: mockWeb3, magicToken: 'MAGIC_TOKEN', loginData: {}},
      } as any);
      assert.deepEqual(gen.next().value, put(resetBalance()));
      assert.deepEqual(gen.next().value, web3.asyncGetAccounts(mockWeb3 as any));
      // @ts-ignore
      assert.deepEqual(gen.next(['WALLET']).value, select(getNetInfo));
      // @ts-ignore
      assert.deepEqual(gen.next(false).value, put(web3.networkDisconnect()));
    });
    it('watchStoreMagicToken failure not found account', () => {
      const gen = web3.watchStoreMagicToken({
        storeMagicToken: {web3: mockWeb3AccountsError, magicToken: 'MAGIC_TOKEN', loginData: {}},
      } as any);
      const spy = jest.spyOn(Promise, 'reject');
      assert.deepEqual(gen.next().value, put(resetBalance()));
      assert.deepEqual(gen.next().value, web3.asyncGetAccounts(mockWeb3AccountsError as any));
      //@ts-ignore
      gen.next(undefined);
      expect(spy).toHaveBeenCalled();
    });
    it('watchStoreMagicToken failure catch', () => {
      const gen = web3.watchStoreMagicToken({
        storeMagicToken: {web3: mockWeb3AccountsError, magicToken: 'MAGIC_TOKEN', loginData: {}},
      } as any);
      gen.next();
      const error = new Error('error is here!');
      assert.deepEqual(
        gen.throw(error).value,
        showSagaAlert({
          title: 'loginFailed.title',
          message: error.message,
          mode: AlertMode.Error,
          alertOptions: {
            translate: true,
          },
        }),
      );
    });
    it('watchStoreMagicToken failure catch without message', () => {
      const gen = web3.watchStoreMagicToken({
        storeMagicToken: {web3: mockWeb3AccountsError, magicToken: 'MAGIC_TOKEN', loginData: {}},
      } as any);
      gen.next();
      const error = new Error('');
      assert.deepEqual(
        gen.throw(error).value,
        showSagaAlert({
          title: 'loginFailed.title',
          message: 'loginFailed.message',
          mode: AlertMode.Error,
          alertOptions: {
            translate: true,
          },
        }),
      );
    });
  });
  describe('selectors', () => {
    it('selectors should be defined', () => {
      expect(web3.selectWeb3).toBeDefined();
      expect(web3.selectConfig).toBeDefined();
      expect(web3.selectMagic).toBeDefined();
      expect(web3.selectWallet).toBeDefined();
      expect(web3.selectAccessToken).toBeDefined();
    });
    it('selectWeb3', () => {
      const gen = web3.selectWeb3();
      assert.deepEqual(gen.next().value, select(web3.getWeb3));
    });
    it('selectConfig', () => {
      const gen = web3.selectConfig();
      assert.deepEqual(gen.next().value, select(web3.getConfig));
    });
    it('selectMagic', () => {
      const gen = web3.selectMagic();
      assert.deepEqual(gen.next().value, select(web3.getMagic));
    });
    it('selectWallet', () => {
      const gen = web3.selectWallet();
      assert.deepEqual(gen.next().value, select(web3.getWallet));
    });
    it('selectAccessToken', () => {
      const gen = web3.selectAccessToken();
      assert.deepEqual(gen.next().value, select(web3.getAccessToken));
    });
  });
});

describe('web3 hook', () => {
  const wrapper = {
    wrapper: props => <AllTheProviders {...(props as any)} initialState={{web3: web3.initialWeb3State}} />,
  };
  describe('useUserWeb3', () => {
    const mockDispatch = jest.fn((action: () => void) => {});
    const spy = jest.spyOn(storeHook, 'useAppDispatch').mockImplementation(() => mockDispatch as any);
    const {result, waitFor} = renderHook(() => web3.useUserWeb3(), wrapper);
    it('should return state value', () => {
      expect(result.current.userId).toBe(web3.initialWeb3State.userId);
      expect(result.current.accessToken).toBe(web3.initialWeb3State.accessToken);
      expect(result.current.web3).toBe(web3.initialWeb3State.web3);
      expect(result.current.magicToken).toBe(web3.initialWeb3State.magicToken);
      expect(result.current.wallet).toBe(web3.initialWeb3State.wallet);
      expect(result.current.treeFactory).toBe(web3.initialWeb3State.treeFactory);
      expect(result.current.planter).toBe(web3.initialWeb3State.planter);
      expect(result.current.planterFund).toBe(web3.initialWeb3State.planterFund);
      expect(result.current.config).toBe(web3.initialWeb3State.config);
      expect(result.current.loading).toBe(web3.initialWeb3State.loading);
      expect(result.current.magic).toBe(web3.initialWeb3State.magic);
      expect(result.current.unlocked).toBe(web3.initialWeb3State.unlocked);
    });
    it('should dispatch changeNetwork', () => {
      act(() => {
        result.current.changeNetwork(BlockchainNetwork.Goerli);
      });
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(web3.changeNetwork(BlockchainNetwork.Goerli));
    });
    it('should dispatch resetWeb3Data', () => {
      act(() => {
        result.current.resetWeb3Data();
      });
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(web3.resetWeb3Data());
    });
    it('should dispatch storeMagicToken', () => {
      act(() => {
        result.current.storeMagicToken('MAGIC_TOKEN', {});
      });
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(
        web3.storeMagicToken({magicToken: 'MAGIC_TOKEN', loginData: {}, web3: web3.initialWeb3State.web3}),
      );
    });
    it('should dispatch createWeb3', () => {
      act(() => {
        result.current.createWeb3();
      });
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(web3.createWeb3());
    });
    it('should clearUserNonce', () => {
      act(() => {
        result.current.clearUserNonce();
      });
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(web3.clearUserNonce());
    });
  });
  describe('useConfig', () => {
    const {result} = renderHook(() => web3.useConfig(), wrapper);
    it('should return state value', () => {
      expect(result.current).toEqual(web3.initialWeb3State.config);
    });
  });
  describe('useMagic', () => {
    const {result} = renderHook(() => web3.useMagic(), wrapper);
    it('should return state value', () => {
      expect(result.current).toEqual(web3.initialWeb3State.magic);
    });
  });
  describe('useWalletWeb3', () => {
    const {result} = renderHook(() => web3.useWalletWeb3(), wrapper);
    it('should return state value', () => {
      expect(result.current).toEqual(web3.initialWeb3State.web3);
    });
  });
  describe('useTreeFactory', () => {
    const {result} = renderHook(() => web3.useTreeFactory(), wrapper);
    it('should return state value', () => {
      expect(result.current).toEqual(web3.initialWeb3State.treeFactory);
    });
  });
  describe('usePlanter', () => {
    const {result} = renderHook(() => web3.usePlanter(), wrapper);
    it('should return state value', () => {
      expect(result.current).toEqual(web3.initialWeb3State.planter);
    });
  });
  describe('usePlanterFund', () => {
    const {result} = renderHook(() => web3.usePlanterFund(), wrapper);
    it('should return state value', () => {
      expect(result.current).toEqual(web3.initialWeb3State.planterFund);
    });
  });
  describe('useWalletAccount', () => {
    const {result} = renderHook(() => web3.useWalletAccount(), wrapper);
    it('should return state value', () => {
      expect(result.current).toEqual(web3.initialWeb3State.wallet);
    });
  });
  describe('useWalletAccountTorus no wallet', () => {
    const {result} = renderHook(() => web3.useWalletAccountTorus(), wrapper);
    it('should return state value', () => {
      expect(result.current).toEqual(null);
    });
  });
  describe('useWalletAccountTorus', () => {
    const wrapper = {
      wrapper: props => (
        <AllTheProviders
          {...(props as any)}
          initialState={{web3: {...web3.initialWeb3State, web3: {eth: {accounts: {wallet: ['WALLET']}}}}}}
        />
      ),
    };
    const {result} = renderHook(() => web3.useWalletAccountTorus(), wrapper);
    it('should return state value', () => {
      expect(result.current).toEqual('WALLET');
    });
  });
  describe('useAccessToken', () => {
    const {result} = renderHook(() => web3.useAccessToken(), wrapper);
    it('should return state value', () => {
      expect(result.current).toEqual('');
    });
  });
  describe('useUserId', () => {
    const {result} = renderHook(() => web3.useUserId(), wrapper);
    it('should return state value', () => {
      expect(result.current).toEqual('');
    });
  });
});
