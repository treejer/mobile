import React, {useEffect} from 'react';
import Toast from 'react-native-toast-notifications';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';

import ApolloProvider from 'services/apollo';
import {isProd, rangerDevUrl, rangerUrl} from 'services/config';
import {RootNavigation, Routes} from 'navigation/Navigation';
import {navigationContainerRef} from 'navigation/navigationRef';
import {isWeb} from 'utilities/helpers/web';
import {AppLoading} from 'components/AppLoading/AppLoading';
import PreLoadImage from 'components/PreloadImage/PreLoadImage';
import LandScapeModal from 'components/LandScapeModal/LandScapeModal';
import UpdateModal from 'components/UpdateModal/UpdateModal';
import {ToastContainer, toastProviderProps} from 'components/Toast/ToastContainer';
import {HeaderFixedButtons} from 'components/HeaderFixedButtons/HeaderFixedButtons';
import {AlertModalProvider} from 'components/Common/AlertModalProvider';
import {useInit} from 'ranger-redux/modules/init/init';
import {useSettings} from 'ranger-redux/modules/settings/settings';

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
            [Routes.TreeInventory_V2]: 'tree-inventory',
            [Routes.TreeDetails]: {
              path: 'tree-inventory/submitted/:tree_id/:tree',
              parse: {
                tree: (tree: any) => (tree ? JSON.parse(tree) : ''),
              },
              stringify: {
                tree: () => '',
              },
            },
            [Routes.NotVerifiedTreeDetails]: {
              path: 'tree-inventory/not-verified/:tree_id/:tree',
              parse: {
                tree: (tree: any) => (tree ? JSON.parse(tree) : ''),
              },
              stringify: {
                tree: () => '',
              },
            },
          },
        },
        [Routes.MyProfile]: 'profile',
        // [Routes.TreeSubmission]: {
        //   screens: {
        //     [Routes.SelectPlantType]: 'tree-submission/type',
        //     [Routes.SelectPhoto]: 'tree-submission/photo',
        //     [Routes.SelectOnMap]: 'tree-submission/location',
        //     [Routes.SubmitTree]: 'tree-submission/submit',
        //     [Routes.SelectModels]: 'tree-submission/models',
        //     [Routes.CreateModel]: 'tree-submission/create-model',
        //   },
        // },
        [Routes.TreeSubmission_V2]: {
          screens: {
            [Routes.SelectPlantType_V2]: 'tree-submission/type',
            [Routes.SubmitTree_V2]: 'tree-submission/submit',
            [Routes.SelectOnMap_V2]: 'tree-submission/map',
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

  const {checkMetaData} = useSettings();

  console.log(checkMetaData, 'checkMetaData is here brooooooooooooooooooooooooooooo');

  useEffect(() => {
    dispatchInit();
  }, [dispatchInit]);

  return loading ? (
    <AppLoading />
  ) : (
    <ApolloProvider>
      <AlertModalProvider>
        <PreLoadImage />
        <HeaderFixedButtons />
        {isWeb() ? <ToastContainer /> : <></>}
        {isWeb() ? <LandScapeModal /> : <></>}
        {!isWeb() ? <UpdateModal /> : <></>}
        <NavigationContainer ref={navigationContainerRef} linking={linking}>
          <RootNavigation />
        </NavigationContainer>
        <Toast ref={ref => (global.toast = ref)} offsetTop={top} {...toastProviderProps} />
      </AlertModalProvider>
    </ApolloProvider>
  );
}
