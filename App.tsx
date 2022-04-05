import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {isWeb} from './src/utilities/helpers/web';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {i18next} from './src/localization';
import {I18nextProvider} from 'react-i18next';
import SettingsProvider, {useAppInitialValue} from './src/services/settings';
import {AppLoading} from './src/components/AppLoading/AppLoading';
import {OfflineTreeProvider} from './src/utilities/hooks/useOfflineTrees';
import Web3Provider from './src/services/web3';
import {NavigationContainer} from '@react-navigation/native';
import {RootNavigation} from './src/navigation';
import {SwitchNetwork} from './src/components/SwitchNetwork/SwitchNetwork';
import NetInfo from './src/components/NetInfo/NetInfo';
import ApolloProvider from './src/services/apollo';
import {CurrentUserProvider} from './src/services/currentUser';
import {ToastContainer} from 'react-toastify';

const linking = {
  prefixes: ['https://treejer-ranger.com'],
};

export default function App() {
  const {
    loading: initialValuesLoading,
    locale,
    useGSN,
    onboardingDone,
    wallet,
    accessToken,
    userId,
    magicToken,
    blockchainNetwork,
  } = useAppInitialValue();

  useEffect(() => {
    if (!isWeb()) {
      SplashScreen.hide();
    }
  }, []);

  return (
    <I18nextProvider i18n={i18next}>
      <SafeAreaProvider>
        {initialValuesLoading ? (
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
                blockchainNetwork={blockchainNetwork}
              >
                <ApolloProvider>
                  <CurrentUserProvider>
                    <NetInfo />
                    <SwitchNetwork />
                    {isWeb() ? <ToastContainer /> : null}
                    <NavigationContainer linking={linking}>
                      <RootNavigation />
                    </NavigationContainer>
                  </CurrentUserProvider>
                </ApolloProvider>
              </Web3Provider>
            </OfflineTreeProvider>
          </SettingsProvider>
        )}
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
