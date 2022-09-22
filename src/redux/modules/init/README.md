# Init

> Init application, dispatch actions by checking user and app conditions

### init state type

```typescript
export type InitState = {
  loading: boolean;
};
```

### init action type

```typescript
export type InitAction = {
  type: string;
};
```

### init initial state 

```typescript
const initInitialState: InitState = {
  loading: true,
};
```

### init async actions

```typescript
function* watchInitApp() {
  try {
    yield put(startWatchConnection());
    yield take(UPDATE_WATCH_CONNECTION);
    yield put(createWeb3());
    yield take(UPDATE_WEB3);
    console.log('started');
    const { accessToken, userId }: TReduxState['web3'] = yield select((state: TReduxState) => state.web3);
    if (accessToken && userId) {
      //  fetch profile data
      // complete init
    } else {
      // reset persist profile data
      // complete init
    }
  }
  ...
  }
```
