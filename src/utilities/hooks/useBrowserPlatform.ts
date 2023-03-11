import {useEffect, useState} from 'react';

export enum BrowserPlatform {
  WindowsPhone = 'WindowsPhone',
  Android = 'Android',
  iOS = 'iOS',
}

export const useBrowserPlatform = () => {
  const [platform, setPlatform] = useState<BrowserPlatform | null>(null);
  useEffect(() => {
    // @ts-ignore
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      setPlatform(BrowserPlatform.WindowsPhone);
    } else if (/android/i.test(userAgent)) {
      setPlatform(BrowserPlatform.Android);
      // @ts-ignore
    } else if (/iPad|iPhone|iPod|Mac/.test(userAgent) && !window.MSStream) {
      setPlatform(BrowserPlatform.iOS);
    }
  }, []);
  return platform;
};
