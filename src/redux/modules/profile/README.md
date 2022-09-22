# Profile

> signed user data, logout action

```typescript
const Profile = new ReduxFetchState<TProfile, TProfileForm, string>('profile');
```

### profile state type

```typescript
type TProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerifiedAt?: string | null;
  idCard?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  mobile?: string | null;
  mobileCountry?: string | null;
  mobileVerifiedAt?: string | null;
  isVerified: boolean;
};
```

### profile async actions

```typescript
export function* watchProfile() {
  try {
    const res: FetchResult<TProfile> = yield sagaFetch<TProfile>(...);
  ...
  }
...
}
```

### User status

```typescript
enum UserStatus {
  Loading,
  Unverified,
  Pending,
  Verified,
}
```

### Profile hooks

```typescript
type TUseProfile = {
  loading: boolean;
  loaded: boolean;
  form: TProfileForm | null;
  error: string | null;
  dispatchProfile: () => void;
  profile: TProfile | null;
  status: UserStatus;
  handleLogout: (userPressed?: boolean) => void;
};

function useProfile(): TUseProfile {
  const {data, ...profileState} = useAppSelector(state => state.profile);
  ...
  logout
  ...
  dispatchProfile
  ...
}
```
