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

  const keyboardBottomProps = {
    _position: 'static',
    _left: '0px',
    _right: '0px',
    _bottom: bottom,
    bg: colors.khaki,
  };

  const closeKeyboard = () => {
    Keyboard.dismiss();
  };

  return {
    height,
    keyboardBottom: bottom,
    keyboardBottomProps,
    closeKeyboard,
  };
}
