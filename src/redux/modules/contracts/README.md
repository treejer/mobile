# Contracts

> Dai, ether, magic balances, transfer and estimate gas price actions

### contracts state type

```typescript
type TContracts = {
  dai: string | BN;
  ether: string | BN;
  fee: string | number | null;
  loading: boolean;
  submitting: boolean;
};
```

### contracts action type

```typescript
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
  fee: { fee: string | number; show?: TShow };
};
```

### contracts initial state

```typescript
initialState: TContracts = {
  dai: '',
  ether: '',
  fee: null,
  loading: false,
  submitting: false,
};
```

### contracts async actions

```typescript
function* watchContracts({getBalance}: TAction) {...}

function* watchTransaction({ transaction }: TAction) {
  const { show, form } = transaction;
  const {amount, from, to} = form;
  ...
}

function* watchEstimateGasPrice({transaction}: TAction) {
  const { show, form } = transaction;
  const { amount, from, to } = form;
  ...
}
```
