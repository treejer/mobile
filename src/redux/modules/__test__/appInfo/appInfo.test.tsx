import {act, renderHook} from '@testing-library/react-hooks';
import {AllTheProviders} from 'ranger-testUtils/testingLibrary';

import * as appInfo from 'ranger-redux/modules/appInfo/appInfo';
import * as storeHook from 'utilities/hooks/useStore';

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
  const mockDispatch = jest.fn((action: () => void) => {});
  const _spy = jest.spyOn(storeHook, 'useAppDispatch').mockImplementation(() => mockDispatch as any);
  const {result} = renderHook(() => appInfo.useAppInfo(), {
    wrapper: props => <AllTheProviders {...(props as any)} initialState={{appInfo: {version: 'VERSION'}}} />,
  });

  it('should return state value', () => {
    expect(result.current.appInfo).toEqual({version: 'VERSION'});
  });

  it('should dispatch checkAppInfo', () => {
    act(() => {
      result.current.dispatchCheckAppVersion();
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(appInfo.checkAppVersion());
  });
});
