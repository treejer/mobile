import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppLoading} from 'components/AppLoading/AppLoading';
import ApolloProvider from 'services/apollo';
import {OfflineTreeProvider} from 'utilities/hooks/useOfflineTrees';
import NetInfo from 'components/NetInfo';
import {SwitchNetwork} from 'components/SwitchNetwork/SwitchNetwork';
import PreLoadImage from 'components/PreloadImage/PreLoadImage';
import {isWeb} from 'utilities/helpers/web';
import {ToastContainer} from 'react-toastify';
import LandScapeModal from 'components/LandScapeModal/LandScapeModal';
import UpdateModal from 'components/UpdateModal/UpdateModal';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import {isProd, rangerDevUrl, rangerUrl} from 'services/config';
import {RootNavigation, Routes} from 'navigation/navigation';
import {useInit} from '../redux/modules/init/init';
import CurrentJourneyProvider from 'services/currentJourney';
import Web3Provider from 'services/web3';
import {useAppInitialValue} from 'services/settings';

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

export function InitNavigation() {
  const {loading, dispatchInit} = useInit();

  useEffect(() => {
    console.log(loading, '<== loading is here');
  }, [loading]);

  const {wallet, accessToken, userId, magicToken, blockchainNetwork} = useAppInitialValue();

  useEffect(() => {
    console.log('use effecttt');
    dispatchInit();
  }, [dispatchInit]);

  return (
    <SafeAreaProvider>
      {loading ? (
        <AppLoading />
      ) : (
        <Web3Provider
          persistedWallet={wallet}
          persistedAccessToken={accessToken}
          persistedUserId={userId}
          persistedMagicToken={magicToken}
          blockchainNetwork={blockchainNetwork}
        >
          <ApolloProvider>
            <OfflineTreeProvider>
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
            </OfflineTreeProvider>
          </ApolloProvider>
        </Web3Provider>
      )}
    </SafeAreaProvider>
  );
}
