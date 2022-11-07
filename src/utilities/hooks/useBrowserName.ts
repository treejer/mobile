import {useEffect, useState} from 'react';

export enum BrowserName {
  Opera = 'Opera',
  Chrome = 'Chrome',
  Safari = 'Safari',
  Firefox = 'Firefox',
  IE = 'IE',
  Unknown = 'Unknown',
}

export function useBrowserName() {
  const [browserName, setBrowserName] = useState<BrowserName | null>(null);

  useEffect(() => {
    if (/Opera|OPR/.test(window.navigator.userAgent)) {
      setBrowserName(BrowserName.Opera);
    } else if (/Chrome/.test(window.navigator.userAgent)) {
      setBrowserName(BrowserName.Chrome);
    } else if (/Safari/.test(window.navigator.userAgent)) {
      setBrowserName(BrowserName.Safari);
    } else if (/Firefox/.test(window.navigator.userAgent)) {
      setBrowserName(BrowserName.Firefox);
    } else if (/IE|MSIE/.test(window.navigator.userAgent)) {
      setBrowserName(BrowserName.IE);
    } else {
      setBrowserName(BrowserName.Unknown);
    }
  }, []);

  return browserName;
}
