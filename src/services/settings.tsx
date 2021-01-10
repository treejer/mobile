import AsyncStorage from '@react-native-community/async-storage';
import React, {memo, useCallback, useContext, useEffect, useMemo, useState} from 'react';

export const SettingsContext = React.createContext({
  onboardingDone: false,
  locale: '',
  markOnboardingAsDone() {},
  updateLocale(_newLocale: string) {},
});

interface Props {
  children: React.ReactNode;
  onboardingDoneInitialState: boolean;
  localeInitialState: string;
}

interface InitialValueHookResult {
  loaded: boolean;
  locale?: string;
  onboardingDone?: boolean;
}

const LOCALE_KEY = '__LOCALE';
const ONBOARDING_DONE_KEY = '__ONBOARDING';

function SettingsProvider({onboardingDoneInitialState, localeInitialState, children}: Props) {
  const [onboardingDone, setOnboardingDone] = useState(onboardingDoneInitialState);
  const [locale, setLocale] = useState(localeInitialState);

  // AsyncStorage.clear();

  const markOnboardingAsDone = useCallback(() => {
    AsyncStorage.setItem(ONBOARDING_DONE_KEY, '1');
    setOnboardingDone(true);
  }, []);
  const updateLocale = useCallback((newLocale: string) => {
    AsyncStorage.setItem(LOCALE_KEY, newLocale);
    setLocale(newLocale);
  }, []);

  const value = useMemo(
    () => ({
      onboardingDone,
      markOnboardingAsDone,
      locale,
      updateLocale,
    }),
    [onboardingDone, markOnboardingAsDone, locale, updateLocale],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export default memo(SettingsProvider);

export const useSettings = () => useContext(SettingsContext);
export const useSettingsInitialValue = () => {
  const [initialValue, setInitialValue] = useState<InitialValueHookResult>({
    loaded: false,
  });

  useEffect(() => {
    AsyncStorage.multiGet([LOCALE_KEY, ONBOARDING_DONE_KEY])
      .then(stores => {
        const result = stores.reduce(
          (result, [key, value]) => {
            switch (key) {
              case LOCALE_KEY:
                return {
                  ...result,
                  locale: value ?? '',
                };
              case ONBOARDING_DONE_KEY:
                return {
                  ...result,
                  onboardingDone: Boolean(value) ?? false,
                };
              default:
                return result;
            }
          },
          {loaded: true} as InitialValueHookResult,
        );

        setInitialValue(result);
      })
      .catch(() => {
        console.warn('Failed to get settings info from storage');
      });
  }, []);

  return initialValue;
};
