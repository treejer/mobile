import {useEffect, useMemo, useState} from 'react';
import {Keyboard, Platform} from 'react-native';

import {colors} from 'constants/values';

export function useKeyboardHeight() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const showListener = Keyboard.addListener(Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow', e => {
      setHeight(e.endCoordinates.height);
    });

    const hideListener = Keyboard.addListener(Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide', e => {
      setHeight(0);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const bottom = useMemo(
    () =>
      Platform.select({
        ios: `${height ? height - 32 : 0}px`,
        android: '0px',
      }),
    [height],
  );

  const keyboardBottomStyles = {
    position: 'static',
    left: '0px',
    right: '0px',
    bottom: bottom,
    backgroundColor: colors.khaki,
  };

  const closeKeyboard = () => {
    Keyboard.dismiss();
  };

  return {
    height,
    keyboardBottom: bottom,
    keyboardBottomStyles,
    closeKeyboard,
  };
}
