# Settings

> Language and useGSN, and actions for change them

### settings state type

```typescript
type TSettings = {
  onBoardingDone: boolean;
  locale: string;
  useGSN: boolean;
  showSupportChat: boolean;
};
```

### settings action type

```typescript
type TSettingsAction = {
  type: string;
  useGSN: boolean;
  locale: string;
  showSupportChat: boolean;
};
```

### settings initial state

```typescript
const initialState: TSettings = {
  onBoardingDone: false,
  locale: defaultLocale,
  useGSN: true,
  showSupportChat: false,
};
```

### settings hooks

```typescript
type TUseSettings = TReduxState['settings'] & {
  updateLocale: (newLocale: string) => void;
  markOnBoardingDone: () => void;
  changeUseGSN: (useGSN: boolean) => void;
  resetOnBoardingData: () => void;
  setShowSupportChat: (showSupportChat: boolean) => void;
};

function useSettings(): TUseSettings {
  const settings = useAppSelector(state => state.settings);
  const dispatch = useAppDispatch();
  ...
  // update locale
  ...
  // mark onboarding done
  ... 
  // change use gsn
  ... 
  // reset onboarding data
  ...
}
```

### settings saga selectors 
```typescript
function* selectSettings() {
  return yield select((state: TReduxState) => state.settings);
}
```
