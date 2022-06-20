import analytics from '@react-native-firebase/analytics';
import {useCallback} from 'react';
import {AnalyticsParams} from 'components/Analytics/Analytics';

export interface UseAnalyticsHook {
  sendEvent: (name: string, params?: AnalyticsParams) => void;
}

export function useAnalytics(): UseAnalyticsHook {
  const sendEvent = useCallback(async (name: string, params?: AnalyticsParams) => {
    try {
      await analytics().logEvent(name, params);
    } catch (e) {
      console.log(e, 'error inside useAnalytics');
    }
  }, []);

  return {sendEvent};
}
