import {useEffect, useState} from 'react';

export const useBrowserPlatform = () => {
  const [platform, setPlatform] = useState<string | null>(null);
  useEffect(() => {
    // @ts-ignore
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      setPlatform('WindowsPhone');
    } else if (/android/i.test(userAgent)) {
      setPlatform('Android');
      // @ts-ignore
    } else if (/iPad|iPhone|iPod|Mac/.test(userAgent) && !window.MSStream) {
      setPlatform('iOS');
    }
  }, []);
  return platform;
};
