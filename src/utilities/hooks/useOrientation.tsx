import {useCallback, useEffect, useState} from 'react';

const landscapeAngles = [90, 270];

const useOrientation = () => {
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    checkLandscapeScreen();
    window.addEventListener('orientationchange', checkLandscapeScreen);
    return () => {
      window.removeEventListener('orientationchange', checkLandscapeScreen);
    };
  }, []);

  const checkLandscapeScreen = useCallback(() => {
    const angle =
      (window.screen.orientation || {}).angle ||
      window.orientation ||
      // @ts-ignore
      window.screen.mozOrientation ||
      // @ts-ignore
      window.screen.msOrientation;
    setIsLandscape(landscapeAngles.includes(Math.abs(angle)));
  }, []);

  return isLandscape;
};

export default useOrientation;
