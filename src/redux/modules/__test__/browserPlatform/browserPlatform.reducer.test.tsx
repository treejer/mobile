import assert from 'assert';
import {select} from 'redux-saga/effects';
import {renderHook} from '@testing-library/react-hooks';
import {AllTheProviders} from 'ranger-testUtils/testingLibrary';

import {BrowserPlatform} from 'utilities/hooks/useBrowserPlatform';
import {
  browserPlatformInitialState,
  browserPlatformReducer,
  getBrowserPlatform,
  selectBrowserPlatform,
  useBrowserPlatform,
} from 'ranger-redux/modules/browserPlatform/browserPlatform.reducer';
import * as actionsList from 'ranger-redux/modules/browserPlatform/browserPlatform.action';

describe('browserPlatform reducer', () => {
  it('should return initial state', () => {
    expect(browserPlatformReducer(browserPlatformInitialState, {type: ''})).toEqual(browserPlatformInitialState);
  });

  it('should handle PROCESS_BROWSER_PLATFORM, BrowserPlatform = WindowsPhone', () => {
    global.navigator = {
      userAgent: 'windows phone',
      vendor: 'windows phone',
      //@ts-ignore
      opera: 'windows phone',
    };
    expect(browserPlatformReducer(browserPlatformInitialState, actionsList.processBrowserPlatform())).toEqual({
      platform: BrowserPlatform.WindowsPhone,
    });
  });
  it('should handle PROCESS_BROWSER_PLATFORM, BrowserPlatform = Android', () => {
    global.navigator = {
      userAgent: 'android',
      vendor: 'android',
      //@ts-ignore
      opera: 'android',
    };
    expect(browserPlatformReducer(browserPlatformInitialState, actionsList.processBrowserPlatform())).toEqual({
      platform: BrowserPlatform.Android,
    });
  });
  it('should handle PROCESS_BROWSER_PLATFORM, BrowserPlatform = IOS', () => {
    global.navigator = {
      userAgent: 'iPhone',
      vendor: 'iPhone',
      //@ts-ignore
      opera: 'iPhone',
      MSStream: undefined,
    };
    expect(browserPlatformReducer(browserPlatformInitialState, actionsList.processBrowserPlatform())).toEqual({
      platform: BrowserPlatform.iOS,
    });
  });
  it('should handle PROCESS_BROWSER_PLATFORM, BrowserPlatform = IOS', () => {
    global.navigator = {
      userAgent: 'iPod',
      vendor: 'iPod',
      //@ts-ignore
      opera: 'iPod',
      MSStream: undefined,
    };
    expect(browserPlatformReducer(browserPlatformInitialState, actionsList.processBrowserPlatform())).toEqual({
      platform: BrowserPlatform.iOS,
    });
  });
  it('should handle PROCESS_BROWSER_PLATFORM, BrowserPlatform = IOS', () => {
    global.navigator = {
      userAgent: 'Mac',
      vendor: 'Mac',
      //@ts-ignore
      opera: 'Mac',
      MSStream: undefined,
    };
    expect(browserPlatformReducer(browserPlatformInitialState, actionsList.processBrowserPlatform())).toEqual({
      platform: BrowserPlatform.iOS,
    });
  });
  it('should handle PROCESS_BROWSER_PLATFORM, BrowserPlatform = IOS', () => {
    global.navigator = {
      userAgent: 'iPad',
      vendor: 'iPad',
      //@ts-ignore
      opera: 'IPad',
      MSStream: undefined,
    };
    expect(browserPlatformReducer(browserPlatformInitialState, actionsList.processBrowserPlatform())).toEqual({
      platform: BrowserPlatform.iOS,
    });
  });
  it('should handle PROCESS_BROWSER_PLATFORM, no platform', () => {
    global.navigator = {
      //@ts-ignore
      userAgent: null,
      //@ts-ignore
      vendor: null,
      //@ts-ignore
      opera: null,
      MSStream: undefined,
    };
    expect(browserPlatformReducer(browserPlatformInitialState, actionsList.processBrowserPlatform())).toEqual({
      platform: null,
    });
  });
});

describe('browserPlatform hook', () => {
  const wrapper = {
    wrapper: props => (
      <AllTheProviders {...(props as any)} initialState={{browserPlatform: {platform: BrowserPlatform.iOS}}} />
    ),
  };
  const {result} = renderHook(() => useBrowserPlatform(), wrapper);
  it('should return state value', () => {
    expect(result.current).toEqual({platform: BrowserPlatform.iOS});
  });
});

describe('browserPlatform selectors', () => {
  it('should be defined', () => {
    expect(selectBrowserPlatform).toBeDefined();
  });
  it('selectBrowserPlatform', () => {
    const gen = selectBrowserPlatform();
    assert.deepEqual(gen.next().value, select(getBrowserPlatform));
  });
});
