import './src/globals';
import React, {useEffect, useRef} from 'react';
import AppLoading from 'expo-app-loading';
import {useFonts} from 'expo-font';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import TorusSdk from "@toruslabs/torus-direct-react-native-sdk";

import MainTabs from './src/screens/MainTabs';
import Onboarding from './src/screens/Onboarding';
import Web3Provider, {Web3Context, usePersistedWallet} from './src/services/web3';
import ApolloProvider from './src/services/apollo';
import SettingsProvider, {useSettingsInitialValue, SettingsContext} from './src/services/settings';

function App() {
  const [fontsLoaded] = useFonts({
    Montserrat: require('./assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf'),
    'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
  });

  const [privateKeyLoaded, privateKey] = usePersistedWallet();
  const {loaded: settingsLoaded, locale, onboardingDone} = useSettingsInitialValue();
  const navigationRef = useRef<NavigationContainerRef>();
  const loading = !fontsLoaded || !privateKeyLoaded || !settingsLoaded;

  useEffect(() => {
    if (!loading) {
      TorusSdk.init({
        // redirectUri: "torusapp://org.torusresearch.torusdirectexample/redirect",
        redirectUri: 'com.treejer.ranger://torus/redirect',
        network: 'testnet', // details for test net
        // proxyContractAddress: '0x4023d2a0D330bF11426B12C6144Cfb96B7fa6183', // details for test net
        browserRedirectUri: 'https://scripts.toruswallet.io/redirect.html'
      });

      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    return <AppLoading />;
  }

  return (
    <SettingsProvider onboardingDoneInitialState={onboardingDone} localeInitialState={locale}>
      <Web3Provider privateKey={privateKey}>
        <Web3Context.Consumer>
          {({waiting}) =>
            waiting ? null : (
              <ApolloProvider>
                <SettingsContext.Consumer>
                  {value => {
                    if (!value.locale || !value.onboardingDone) {
                      return <Onboarding />;
                    }

                    return (
                      <NavigationContainer ref={navigationRef}>
                        <MainTabs navigation={navigationRef.current as any} />
                      </NavigationContainer>
                    );
                  }}
                </SettingsContext.Consumer>
              </ApolloProvider>
            )
          }
        </Web3Context.Consumer>
      </Web3Provider>
    </SettingsProvider>
  );
}

export default App;
