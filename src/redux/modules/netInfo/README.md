# NetInfo

> Checking network connection and change it after change network status

### netInfo state type

```typescript
export type TNetInfo = {
  isConnected: boolean;
};
```
### netInfo action type

```typescript
type TNetInfoAction = {
  type: string;
  isConnected: boolean;
  dispatch: Dispatch<Action<any>>;
};
```
### netInfo initial state

```typescript
const initialState: TNetInfo = {
  isConnected: true,
};
```


### netInfo async actions

```typescript
function* watchStartWatchConnection(store) {...}
```

### netInfo saga selectors

```typescript
function* netInfoSagas(store: TStoreRedux) {
  yield takeEvery(START_WATCH_CONNECTION, watchStartWatchConnection, store);
}

function* selectNetInfo() {
  return yield select((state: TReduxState) => state.netInfo.isConnected);
}
```

### netInfo hooks

```typescript
function useNetInfo(): TReduxState['netInfo'] {
  return useAppSelector(state => state.netInfo);
}
```
