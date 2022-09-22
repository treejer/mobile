# UserSign

>  get user accessibility

```typescript
const UserSign = new ReduxFetchState<UserSignRes, UserSignForm, string>('userSign');
```

### userSign action type

```typescript
export type TUserSignAction = {
type: string;
payload: UserSignForm;
};
```

### userSign async actions

```typescript
function* watchUserSign(action: TUserSignAction) {
  try {
    const { signature, wallet } = action.payload;
    ...
    const res = yield call(() => fetch(..., options));
    ...
  }
  ...
}
```
