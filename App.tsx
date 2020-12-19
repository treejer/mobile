import './src/globals';
import React, {useRef} from 'react';
import {AppLoading} from 'expo';
import {useFonts} from 'expo-font';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import MainTabs from './src/screens/MainTabs';
import Onboarding from './src/screens/Onboarding';
import Web3Provider, {Web3Context, usePersistedWallet} from './src/services/web3';
import ApolloProvider from './src/services/apollo';
import SettingsProvider, {useSettingsInitialValue, SettingsContext} from './src/services/settings';
// import PasswordProtected from './src/screens/PasswordProtected';

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

  if (!fontsLoaded || !privateKeyLoaded || !settingsLoaded) {
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
