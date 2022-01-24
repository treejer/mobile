import './src/globals';
import React, {useEffect, useRef} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SettingsProvider, {useSettingsInitialValue, SettingsContext} from './src/services/settings';
import * as SplashScreen from 'expo-splash-screen';
import {OfflineTreeProvider} from './src/utilities/hooks/useOfflineTrees';
import Web3Provider, {Web3Context, usePersistedWallet} from './src/services/web3';
import ApolloProvider from './src/services/apollo';
import {I18nextProvider} from 'react-i18next';
import Onboarding from './src/screens/Onboarding';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import MainTabs from './src/screens/MainTabs';
import NetInfo from './src/components/NetInfo';
import {i18next} from './src/localization';
import TorusSdk from '@toruslabs/customauth-react-native-sdk';
import {useInitialDeepLinking} from './src/utilities/hooks/useDeepLinking';
import {useFonts} from 'expo-font';
import AppLoading from 'expo-app-loading';

const linking = {
  prefixes: ['https://treejer-ranger.com'],
};
export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat: require('./assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf'),
    'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
  });

  const [privateKeyLoaded, privateKey] = usePersistedWallet();
  const {loaded: settingsLoaded, locale, onboardingDone} = useSettingsInitialValue();
  const navigationRef = useRef<NavigationContainerRef<any>>();
  const loading = !privateKeyLoaded || !settingsLoaded;

  useInitialDeepLinking();

  useEffect(() => {
    (async () => {
      await handleInit();
      await SplashScreen.hideAsync();
    })();
  }, []);

  const handleInit = async () => {
    try {
      TorusSdk.init({
        redirectUri: 'treejer://torus/redirect',
        network: 'testnet',
        // proxyContractAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183',
        browserRedirectUri: 'https://api.treejer.com/toruswallet_redirect.html',
      });
    } catch (error) {
      console.log(error, '====> e <====');
    }
  };
  if (loading) {
    return <AppLoading />;
  }

  return (
    <I18nextProvider i18n={i18next}>
      <SafeAreaProvider>
        <SettingsProvider onboardingDoneInitialState={onboardingDone} localeInitialState={locale}>
          <OfflineTreeProvider>
            <Web3Provider privateKey={privateKey}>
              <Web3Context.Consumer>
                {({waiting}) =>
                  waiting ? null : (
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
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
