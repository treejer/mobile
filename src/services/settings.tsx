import React, {memo, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {i18next} from '../localization';
import config from 'services/config';

export const SettingsContext = React.createContext({
  onboardingDone: false,
  locale: '',
  markOnboardingAsDone() {},
  resetOnBoardingData() {},
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

  useEffect(() => {
    (async function () {
      try {
        const cachedLocale = (await AsyncStorage.getItem(LOCALE_KEY)) || config.defaultLocale;
        await i18next.changeLanguage(cachedLocale);
      } catch (e) {
        console.log(e, 'e inside cachedLocale');
      }
    })();
  }, []);

  // AsyncStorage.clear();

  const markOnboardingAsDone = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_DONE_KEY, '1');
      setOnboardingDone(true);
    } catch (e) {
      console.log(e, 'e inside markOnboardingAsDone');
    }
  }, []);

  const resetOnBoardingData = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_DONE_KEY, '0');
      setOnboardingDone(false);
    } catch (e) {
      console.log(e, 'e inside resetOnBoardingData');
    }
  }, []);

  const updateLocale = useCallback(async (newLocale: string) => {
    try {
      await AsyncStorage.setItem(LOCALE_KEY, newLocale);
      setLocale(newLocale);
      await i18next.changeLanguage(newLocale);
    } catch (e) {
      console.log(e, 'e inside updateLocale');
    }
  }, []);

  const value = useMemo(
    () => ({
      onboardingDone,
      markOnboardingAsDone,
      resetOnBoardingData,
      locale,
      updateLocale,
    }),
    [onboardingDone, markOnboardingAsDone, resetOnBoardingData, locale, updateLocale],
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
                  onboardingDone: Boolean(value),
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
