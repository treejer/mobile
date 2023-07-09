import {renderHook} from '@testing-library/react-hooks';
import {AllTheProviders} from 'ranger-testUtils/testingLibrary';

import * as appInfo from 'ranger-redux/modules/appInfo/appInfo';

describe('appInfo actions', () => {
  it('check app versions', () => {
    const expectedAction = {
      type: appInfo.CHECK_APP_VERSION,
    };
    expect(appInfo.checkAppVersion()).toEqual(expectedAction);
  });
});
describe('appInfo reducer', () => {
  it('should return initialState', () => {
    const initialState = {version: 'VERSION'};
    expect(appInfo.appInfoReducer(initialState)).toEqual(initialState);
  });
});

describe('appInfo hook', () => {
  const {result} = renderHook(() => appInfo.useAppInfo(), {
    wrapper: props => <AllTheProviders {...(props as any)} initialState={{appInfo: {version: 'VERSION'}}} />,
  });
  jest.mock('');

  it('should return state value', () => {
    expect(result.current.appInfo).toEqual({version: 'VERSION'});
  });
});
