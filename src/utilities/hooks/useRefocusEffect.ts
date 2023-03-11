import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';

export function useRefocusEffect(callback: Function) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (mounted) {
        callback();
      }
    }, [mounted]),
  );
}
