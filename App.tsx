import React, {useEffect, useRef} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SettingsProvider, {useSettingsInitialValue, SettingsContext} from './src/services/settings';
import SplashScreen from 'react-native-splash-screen';
import {OfflineTreeProvider} from './src/utilities/hooks/useOfflineTrees';
import Web3Provider, {Web3Context, usePersistedWallet, usePersistedMagic} from './src/services/web3';
import ApolloProvider from './src/services/apollo';
import {I18nextProvider} from 'react-i18next';
import Onboarding from './src/screens/Onboarding';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import MainTabs from './src/screens/MainTabs';
import NetInfo from './src/components/NetInfo';
import {i18next} from './src/localization';
import {useInitialDeepLinking} from './src/utilities/hooks/useDeepLinking';
import {magic} from './src/services/Magic';
import {AppLoading} from './src/components/AppLoading/AppLoading';

const linking = {
  prefixes: ['https://treejer-ranger.com'],
};

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
    (async () => {
      await handleInit();
    })();
  }, []);

  const [magicTokenLoaded, magicToken] = usePersistedMagic();
  const {loaded: settingsLoaded, locale, onboardingDone} = useSettingsInitialValue();
  const navigationRef = useRef<NavigationContainerRef<any>>();
  const loading = !settingsLoaded || !magicTokenLoaded;

  useInitialDeepLinking();

  const handleInit = async () => {
    try {
      // TorusSdk.init({
      //   redirectUri: 'treejer://torus/redirect',
      //   network: 'testnet',
      //   // proxyContractAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183',
      //   browserRedirectUri: 'https://api.treejer.com/toruswallet_redirect.html',
      // });
    } catch (error) {
      console.log(error, '====> e <====');
    }
  };

  return (
    <I18nextProvider i18n={i18next}>
      <magic.Relayer />
      <SafeAreaProvider>
        {loading ? (
          <AppLoading />
        ) : (
          <SettingsProvider onboardingDoneInitialState={onboardingDone} localeInitialState={locale}>
            <OfflineTreeProvider>
              <Web3Provider persistedMagicToken={magicToken}>
                <Web3Context.Consumer>
                  {({waiting}) =>
                    waiting ? (
                      <AppLoading />
                    ) : (
                      <ApolloProvider>
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
