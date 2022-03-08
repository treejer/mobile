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
  useGSN: true,
  changeUseGsn(value: boolean) {},
});

interface Props {
  children: React.ReactNode;
  onboardingDoneInitialState: boolean;
  localeInitialState: string;
  initialUseGSN?: boolean;
}

interface InitialValueHookResult {
  loading: boolean;
  locale?: string;
  useGSN?: boolean;
  onboardingDone?: boolean;
  wallet?: string;
  accessToken?: string;
  userId?: string;
  magicToken?: string;
}

const LOCALE_KEY = config.storageKeys.locale;
const ONBOARDING_DONE_KEY = config.storageKeys.onBoarding;
const USE_GSN_KEY = config.storageKeys.useGSN;

function SettingsProvider(props: Props) {
  const {onboardingDoneInitialState, localeInitialState, initialUseGSN, children} = props;
  const [onboardingDone, setOnboardingDone] = useState(onboardingDoneInitialState);
  const [locale, setLocale] = useState(localeInitialState);
  const [useGSN, setUseGSN] = useState<boolean | undefined>(initialUseGSN);

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

  const changeUseGsn = useCallback(async value => {
    try {
      await AsyncStorage.setItem(USE_GSN_KEY, JSON.stringify(value));
      setUseGSN(value);
    } catch (e) {
      console.log(e, 'e inside changeUseGsn');
    }
  }, []);

  const value = useMemo(
    () => ({
      onboardingDone,
      markOnboardingAsDone,
      resetOnBoardingData,
      locale,
      updateLocale,
      useGSN,
      changeUseGsn,
    }),
    [onboardingDone, markOnboardingAsDone, resetOnBoardingData, locale, updateLocale, useGSN, changeUseGsn],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export default memo(SettingsProvider);

export const useSettings = () => useContext(SettingsContext);
export const useAppInitialValue = () => {
  const [initialValue, setInitialValue] = useState<InitialValueHookResult>({
    loading: true,
  });

  useEffect(() => {
    AsyncStorage.multiGet([
      LOCALE_KEY,
      ONBOARDING_DONE_KEY,
      USE_GSN_KEY,
      config.storageKeys.userId,
      config.storageKeys.user,
      config.storageKeys.accessToken,
      config.storageKeys.magicWalletAddress,
      config.storageKeys.magicToken,
    ])
      .then(stores => {
        const result = stores.reduce(
          (acc: InitialValueHookResult, [key, value]) => {
            console.log(key, value);
            switch (key) {
              case LOCALE_KEY:
                return {
                  ...acc,
                  locale: value ?? '',
                };
              case ONBOARDING_DONE_KEY:
                return {
                  ...acc,
                  onboardingDone: Boolean(value),
                };
              case USE_GSN_KEY:
                let gsnValue = value;
                try {
                  gsnValue = JSON.parse(value);
                } catch (e) {
                  console.log(e, 'error inside USE_GSN_KEY');
                }
                return {
                  ...acc,
                  useGSN: gsnValue === null ? true : Boolean(gsnValue),
                };
              case config.storageKeys.magicWalletAddress:
                return {
                  ...acc,
                  wallet: value,
                };
              case config.storageKeys.accessToken:
                return {
                  ...acc,
                  accessToken: value,
                };
              case config.storageKeys.userId:
                return {
                  ...acc,
                  userId: value,
                };
              case config.storageKeys.magicToken:
                return {
                  ...acc,
                  magicToken: value,
                };
              default:
                return acc;
            }
          },
          {loading: false} as InitialValueHookResult,
        );

        setInitialValue(result);
      })
      .catch(() => {
        console.warn('Failed to get settings info from storage');
        setInitialValue({
          ...initialValue,
          loading: false,
        });
      });
  }, []);

  return initialValue;
};
