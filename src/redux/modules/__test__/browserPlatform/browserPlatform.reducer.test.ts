import {
  browserPlatformInitialState,
  browserPlatformReducer,
} from 'ranger-redux/modules/browserPlatform/browserPlatform.reducer';
import * as actionsList from 'ranger-redux/modules/browserPlatform/browserPlatform.action';
import {BrowserPlatform} from 'utilities/hooks/useBrowserPlatform';

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
});
