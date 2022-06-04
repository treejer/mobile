import {useCallback} from 'react';

export function useAnalytics() {
  const sendEvent = useCallback(() => {}, []);

  return {sendEvent};
}
