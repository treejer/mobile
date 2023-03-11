# UserNonce

> get user magic token

```typescript
const UserNonce = new ReduxFetchState<UserNonceRes, UserNonceForm, string>('userNonce');
```

### userNonce action type

```typescript
type TUserNonceAction = {
type: string;
payload: UserNonceForm;
};
```

### userNonce async actions

```typescript
function* watchUserNonce(action: TUserNonceAction) {
  try {
    const { wallet, magicToken, loginData } = action.payloåad;
    ...
    const res: FetchResult<UserNonceRes> = yield sagaFetch<UserNonceRes>(...);
    ...
  }
  ...
}
```


