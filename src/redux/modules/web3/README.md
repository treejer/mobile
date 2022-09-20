# Web3

> Web3 and network config, change network, store magic token actions


### web3 state type

```typescript
type TWeb3 = {
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
```

### web3 action type

```typescript
type TWeb3Action = {
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
```

### web3 initial state

```typescript
const defaultConfig = configs[defaultNetwork];
const defaultMagic = magicGenerator(configs[defaultNetwork]);
const defaultWeb3 = new Web3(magicGenerator(configs[defaultNetwork]).rpcProvider);

const initialState: TWeb3 = {
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
```

### web3 async actions

```typescript
function* watchCreateWeb3({newNetwork}: TWeb3Action) {...}
function* watchChangeNetwork(action: TWeb3Action) {
  try {
  const {newNetwork} = action;
  ...
  }
  ...
}
function* watchStoreMagicToken(store, action: TWeb3Action) {
  try {
    const { web3, magicToken, loginData } = action.storeMagicToken;
    ...
  }
  ...
}
```

### web3 hooks

```typescript
type TUseUserWeb3 = TReduxState['web3'] & {
  changeNetwork: (newNetwork: BlockchainNetwork) => void;
  resetWeb3Data: () => void;
  storeMagicToken: (magicToken: string, loginData?: UserNonceForm['loginData']) => void;
  createWeb3: () => void;
};
function useUserWeb3() {
  const web3 = useAppSelector(state => state.web3);
  const dispatch = useAppDispatch();

  // create web3
  ...
  // change network
  ...
  // reset web3 data 
  ...
  // store magictoken 
  ...
}

const useWeb3 = () => useAppSelector(state => state.web3.web3);
const useConfig = () => useAppSelector(state => state.web3.config);
const useMagic = () => useAppSelector(state => state.web3.magic);
const useWalletWeb3 = () => useAppSelector(state => state.web3.web3);
const useTreeFactory = () => useAppSelector(state => state.web3.treeFactory);
const usePlanter = () => useAppSelector(state => state.web3.planter);
const usePlanterFund = () => useAppSelector(state => state.web3.planterFund);

const useWalletAccount = (): string => {
  return useAppSelector(state => state.web3.wallet);
};
const useWalletAccountTorus = (): Account | null => {
  const web3 = useWeb3();
  return web3.eth.accounts.wallet.length ? web3.eth.accounts.wallet[0] : null;
};
const useAccessToken = () => useAppSelector(state => state.web3.accessToken);
const useUserId = () => useAppSelector(state => state.web3.userId);

```

### web3 saga selectors

```typescript
function* selectConfig() {
  return yield select((state: TReduxState) => state.web3.config);
}

function* selectWeb3() {
  return yield select((state: TReduxState) => state.web3.web3);
}

function* selectWallet() {
  return yield select((state: TReduxState) => state.web3.wallet);
}
```
