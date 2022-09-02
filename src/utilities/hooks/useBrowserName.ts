import {useEffect, useState} from 'react';

export type TBrowseName = 'Opera' | 'Chrome' | 'Safari' | 'Firefox' | 'IE' | 'Unknown';

export function useBrowserName() {
  const [browserName, setBrowserName] = useState<TBrowseName | null>(null);

  useEffect(() => {
    if (/Opera|OPR/.test(window.navigator.userAgent)) {
      setBrowserName('Opera');
    } else if (/Chrome/.test(window.navigator.userAgent)) {
      setBrowserName('Chrome');
    } else if (/Safari/.test(window.navigator.userAgent)) {
      setBrowserName('Safari');
    } else if (/Firefox/.test(window.navigator.userAgent)) {
      setBrowserName('Firefox');
    } else if (/IE|MSIE/.test(window.navigator.userAgent)) {
      setBrowserName('IE');
    } else {
      setBrowserName('Unknown');
    }
  }, []);

  return browserName;
}
