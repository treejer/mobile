import * as actionsList from './browserPlatform.action';
import {BrowserPlatform} from 'utilities/hooks/useBrowserPlatform';
import {useAppSelector} from 'utilities/hooks/useStore';

export type BrowserPlatformState = {
  platform: BrowserPlatform | null;
};

export type BrowserPlatformAction = {
  type: string;
};

export const browserPlatformInitialState: BrowserPlatformState = {
  platform: null,
};

export const browserPlatformReducer = (
  state: BrowserPlatformState = browserPlatformInitialState,
  action: BrowserPlatformAction,
) => {
  switch (action.type) {
    case actionsList.PROCESS_BROWSER_PLATFORM: {
      //@ts-ignore
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Windows Phone must come first because its UA also contains "Android"
      if (/windows phone/i.test(userAgent)) {
        return {platform: BrowserPlatform.WindowsPhone};
      } else if (/android/i.test(userAgent)) {
        return {platform: BrowserPlatform.Android};
        // @ts-ignore
      } else if (/iPad|iPhone|iPod|Mac/.test(userAgent) && !window.MSStream) {
        return {
          platform: BrowserPlatform.iOS,
        };
      }
      return browserPlatformInitialState;
    }
    default:
      return state;
  }
};

export const useBrowserPlatform = () => useAppSelector(state => state.browserPlatform);