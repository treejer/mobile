import {useCallback, useEffect, useState} from 'react';

const landscapeTypes = ['landscape-primary', 'landscape-secondary'];

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
    if (landscapeTypes.includes(screen.orientation.type)) {
      setIsLandscape(true);
    } else {
      setIsLandscape(false);
    }
  }, [isLandscape]);

  return isLandscape;
};

export default useOrientation;
