# Settings

> Language and useGSN, and actions for change them
> 
> [Settings hook](../../../utilities/hooks/useSettings.ts) is in the hooks folder

### settings state type

```typescript
type TSettings = {
  onBoardingDone: boolean;
  locale: string;
  useGSN: boolean;
};
```

### settings action type

```typescript
type TSettingsAction = {
  type: string;
  useGSN: boolean;
  locale: string;
};
```

### settings initial state

```typescript
const initialState: TSettings = {
  onBoardingDone: false,
  locale: defaultLocale,
  useGSN: true,
};
```


### settings saga selectors 
```typescript
function* selectSettings() {
  return yield select((state: TReduxState) => state.settings);
}
```
