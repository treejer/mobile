import React, {useEffect} from 'react';
import Toast from 'react-native-toast-notifications';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';

import ApolloProvider from 'services/apollo';
import {isProd, rangerDevUrl, rangerUrl} from 'services/config';
import {RootNavigation, Routes} from 'navigation/Navigation';
import {OfflineTreeProvider} from 'utilities/hooks/useOfflineTrees';
import {isWeb} from 'utilities/helpers/web';
import {AppLoading} from 'components/AppLoading/AppLoading';
import NetInfo from 'components/NetInfo';
import {SwitchNetwork} from 'components/SwitchNetwork/SwitchNetwork';
import PreLoadImage from 'components/PreloadImage/PreLoadImage';
import LandScapeModal from 'components/LandScapeModal/LandScapeModal';
import UpdateModal from 'components/UpdateModal/UpdateModal';
import {ToastContainer, toastProviderProps} from 'components/Toast/ToastContainer';
import CurrentJourneyProvider from 'services/currentJourney';
import {useInit} from '../redux/modules/init/init';

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
            [Routes.SelectModels]: 'tree-submission/models',
            [Routes.CreateModel]: 'tree-submission/create-model',
          },
        },
        [Routes.Withdraw]: {
          screens: {
            [Routes.Transfer]: 'withdraw/transfer',
            [Routes.WithdrawHistory]: 'withdraw/history',
          },
        },
        [Routes.Activity]: 'activity',
      },
    },
    [Routes.Settings]: 'settings',
    [Routes.SelectLanguage]: 'settings/select-language',
    [Routes.Login]: 'login',
    [Routes.Onboarding]: 'on-boarding',
    [Routes.Organization]: 'organization',
    [Routes.Support]: 'support',
  },
};

const linking: LinkingOptions<any> = {
  prefixes: [isProd ? rangerUrl : rangerDevUrl],
  config,
};

export function InitNavigation() {
  const {loading, dispatchInit} = useInit();
  const {top} = useSafeAreaInsets();

  useEffect(() => {
    dispatchInit();
  }, [dispatchInit]);

  return loading ? (
    <AppLoading />
  ) : (
    <ApolloProvider>
      <OfflineTreeProvider>
        <CurrentJourneyProvider>
          <NetInfo />
          <SwitchNetwork />
          <PreLoadImage />
          {isWeb() ? <ToastContainer /> : <></>}
          {isWeb() ? <LandScapeModal /> : <></>}
          {!isWeb() ? <UpdateModal /> : <></>}
          <ToastContainer>
            <NavigationContainer linking={linking}>
              <RootNavigation />
            </NavigationContainer>
            <Toast ref={ref => (global['toast'] = ref)} offsetTop={top} {...toastProviderProps} />
          </ToastContainer>
        </CurrentJourneyProvider>
      </OfflineTreeProvider>
    </ApolloProvider>
  );
}
