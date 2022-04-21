import {useEffect, useState} from 'react';

export const useBrowserPlatform = () => {
  const [platform, setPlatform] = useState<string | null>(null);
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      setPlatform('WindowsPhone');
    }

    if (/android/i.test(userAgent)) {
      setPlatform('Android');
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setPlatform('iOS');
    }
  }, []);
  return platform;
};
