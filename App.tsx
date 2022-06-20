import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {isWeb} from './src/utilities/helpers/web';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {i18next} from './src/localization';
import {I18nextProvider} from 'react-i18next';
import SettingsProvider, {useAppInitialValue} from './src/services/settings';
import CurrentJourneyProvider from './src/services/currentJourney';
import {AppLoading} from './src/components/AppLoading/AppLoading';
import {OfflineTreeProvider} from './src/utilities/hooks/useOfflineTrees';
import Web3Provider from './src/services/web3';
import {NavigationContainer, LinkingOptions} from '@react-navigation/native';
import {RootNavigation, Routes} from './src/navigation';
import {SwitchNetwork} from './src/components/SwitchNetwork/SwitchNetwork';
import NetInfo from './src/components/NetInfo/NetInfo';
import ApolloProvider from './src/services/apollo';
import {CurrentUserProvider} from './src/services/currentUser';
import {ToastContainer} from 'react-toastify';
import {isProd, rangerDevUrl, rangerUrl} from './src/services/config';
import Orientation from 'react-native-orientation';
import LandScapeModal from './src/components/LandScapeModal/LandScapeModal';
import UpdateModal from './src/components/UpdateModal/UpdateModal';
import {useInitialDeepLinking} from './src/utilities/hooks/useDeepLinking';
import PreLoadImage from './src/components/PreloadImage/PreLoadImage';

const config = {
  screens: {
    [Routes.Init]: '',
    [Routes.UnVerifiedProfileStack]: {
      screens: {
        [Routes.MyProfile]: 'unverified-profile',
        [Routes.VerifyProfile]: 'profile/verify',
      },
    },
    [Routes.VerifiedProfileTab]: {
      screens: {
        [Routes.GreenBlock]: {
          screens: {
            [Routes.TreeList]: 'trees',
            [Routes.TreeDetails]: {
              path: 'trees/:tree_id/:tree',
              parse: {
                tree: tree => (tree ? JSON.parse(tree) : ''),
              },
              stringify: {
                tree: () => '',
              },
            },
          },
        },
        [Routes.MyProfile]: 'profile',
        [Routes.TreeSubmission]: {
          screens: {
            [Routes.SelectPlantType]: 'tree-submission/type',
            [Routes.SelectPhoto]: 'tree-submission/photo',
            [Routes.SelectOnMap]: 'tree-submission/location',
            [Routes.SubmitTree]: 'tree-submission/submit',
          },
        },
      },
    },
    [Routes.Settings]: 'settings',
    [Routes.SelectLanguage]: 'settings/select-language',
    [Routes.Login]: 'login',
    [Routes.Onboarding]: 'on-boarding',
    [Routes.Organization]: 'organization',
  },
};

const linking: LinkingOptions<any> = {
  prefixes: [isProd ? rangerUrl : rangerDevUrl],
  config,
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
  useInitialDeepLinking();

  useEffect(() => {
    if (!isWeb()) {
      Orientation.lockToPortrait();
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
            <Web3Provider
              persistedWallet={wallet}
              persistedAccessToken={accessToken}
              persistedUserId={userId}
              persistedMagicToken={magicToken}
              blockchainNetwork={blockchainNetwork}
            >
              <ApolloProvider>
                <OfflineTreeProvider>
                  <CurrentUserProvider>
                    <CurrentJourneyProvider>
                      <NetInfo />
                      <SwitchNetwork />
                      <PreLoadImage />
                      {isWeb() ? <ToastContainer /> : <></>}
                      {isWeb() ? <LandScapeModal /> : <></>}
                      {!isWeb() ? <UpdateModal /> : <></>}
                      <NavigationContainer linking={linking}>
                        <RootNavigation />
                      </NavigationContainer>
                    </CurrentJourneyProvider>
                  </CurrentUserProvider>
                </OfflineTreeProvider>
              </ApolloProvider>
            </Web3Provider>
          </SettingsProvider>
        )}
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
