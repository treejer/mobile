import {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';

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
