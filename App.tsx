import React, {useEffect, useRef} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SettingsProvider, {useAppInitialValue, SettingsContext} from './src/services/settings';
import SplashScreen from 'react-native-splash-screen';
import {OfflineTreeProvider} from './src/utilities/hooks/useOfflineTrees';
import Web3Provider, {Web3Context} from './src/services/web3';
import ApolloProvider from './src/services/apollo';
import {I18nextProvider} from 'react-i18next';
import Onboarding from './src/screens/Onboarding';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import MainTabs from './src/screens/MainTabs';
import NetInfo from './src/components/NetInfo';
import {i18next} from './src/localization';
import {useInitialDeepLinking} from './src/utilities/hooks/useDeepLinking';
import {AppLoading} from './src/components/AppLoading/AppLoading';
import {CurrentUserProvider} from './src/services/currentUser';
import {magic} from './src/services/Magic';

const linking = {
  prefixes: ['https://treejer-ranger.com'],
};

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const {loading, locale, useGSN, onboardingDone, wallet, accessToken, userId, magicToken} = useAppInitialValue();
  const navigationRef = useRef<NavigationContainerRef<any>>();

  useInitialDeepLinking();

  return (
    <I18nextProvider i18n={i18next}>
      <magic.Relayer />
      <SafeAreaProvider>
        {loading ? (
          <AppLoading />
        ) : (
          <SettingsProvider
            initialUseGSN={useGSN}
            onboardingDoneInitialState={onboardingDone}
            localeInitialState={locale}
          >
            <OfflineTreeProvider>
              <Web3Provider
                persistedWallet={wallet}
                persistedAccessToken={accessToken}
                persistedUserId={userId}
                persistedMagicToken={magicToken}
              >
                <Web3Context.Consumer>
                  {({waiting, loading}) =>
                    waiting && loading ? (
                      <AppLoading />
                    ) : (
                      <ApolloProvider>
                        <CurrentUserProvider>
                          <SettingsContext.Consumer>
                            {value => {
                              const app =
                                !value.locale || !value.onboardingDone ? (
                                  <Onboarding />
                                ) : (
                                  <NavigationContainer linking={linking} ref={navigationRef}>
                                    <MainTabs />
                                  </NavigationContainer>
                                );
                              return (
                                <>
                                  <NetInfo />
                                  {app}
                                </>
                              );
                            }}
                          </SettingsContext.Consumer>
                        </CurrentUserProvider>
                      </ApolloProvider>
                    )
                  }
                </Web3Context.Consumer>
              </Web3Provider>
            </OfflineTreeProvider>
          </SettingsProvider>
        )}
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
