import {useEffect, useState} from 'react';
import {AppState, AppStateStatus} from 'react-native';

export function useAppState() {
  const [appState, setAppState] = useState<AppStateStatus>();

  useEffect(() => {
    const listener = AppState.addEventListener('change', state => {
      setAppState(state);
    });

    return () => {
      listener.remove();
    };
  }, []);

  return {
    appState,
  };
}
