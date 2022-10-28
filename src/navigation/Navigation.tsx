import React from 'react';
import {createStackNavigator, StackScreenProps as LibraryProp} from '@react-navigation/stack';

import {AppLoading} from 'components/AppLoading/AppLoading';
import PwaModal from 'components/PwaModal/PwaModal';
import NoWallet from 'screens/Profile/screens/NoWallet/NoWallet';
import SelectLanguage from 'screens/Onboarding/screens/SelectLanguage/SelectLanguage';
import {SupportScreen} from 'screens/Profile/screens/Support/SupportScreen';
import OfflineMap from 'screens/Profile/screens/OfflineMap/OfflineMap';
import SavedAreas from 'screens/Profile/screens/SavedAreas/SavedAreas';
import SettingsScreen from 'screens/Profile/screens/Settings/SettingsScreen';
import OnboardingSlides from 'screens/Onboarding/screens/OnboardingSlides/OnboardingSlides';
import {isWeb} from 'utilities/helpers/web';
import {screenTitle} from 'utilities/helpers/documentTitle';
import {VerifiedUserNavigation} from './VerifiedUser';
import {UnVerifiedUserNavigation} from './UnVerifiedUser';
import {useUserWeb3} from '../redux/modules/web3/web3';
import {useSettings} from '../redux/modules/settings/settings';
import {useProfile, UserStatus} from '../redux/modules/profile/profile';
import {TestScreen} from 'screens/TestScreen';

export type RootNavigationParamList = {
  [Routes.Init]: undefined;
  [Routes.SelectLanguage]: {
    back?: boolean;
  };
  [Routes.Onboarding]: undefined;
  [Routes.Login]: undefined;
  [Routes.UnVerifiedProfileStack]: undefined;
  [Routes.VerifiedProfileTab]: undefined;
  [Routes.OfflineMap]: undefined;
  [Routes.Settings]: undefined;
  [Routes.SavedAreas]: undefined;
  [Routes.Organization]: undefined;
  [Routes.Support]: undefined;
};

export type RootNavigationProp<ScreenName extends keyof RootNavigationParamList> = LibraryProp<
  RootNavigationParamList,
  ScreenName
>;

export const RootStack = createStackNavigator<RootNavigationParamList>();

export enum Routes {
  Init = 'Init',
  SelectLanguage = 'SelectLanguage',
  Onboarding = 'Onboarding',
  Login = 'Login',
  UnVerifiedProfileStack = 'UnVerifiedProfileStack',
  VerifiedProfileTab = 'VerifiedProfileTab',
  MyProfile = 'MyProfile',
  OfflineMap = 'OfflineMap',
  VerifyProfile = 'VerifyProfile',
  SelectOnMapVerifyProfile = 'SelectOnMapVerifyProfile',
  VerifyPending = 'VerifyPending',
  Settings = 'Settings',
  SavedAreas = 'SavedAreas',
  SelectOnMap = 'SelectOnMap',
  TreeSubmission = 'TreeSubmission',
  GreenBlock = 'GreenBlock',
  SelectPhoto = 'SelectPhoto',
  SelectPlantType = 'SelectPlantType',
  SelectModels = 'SelectModels',
  CreateModel = 'CreateModel',
  SubmitTree = 'SubmitTree',
  TreeList = 'TreeList',
  TreeDetails = 'TreeDetails',
  Organization = 'Organization',
  Withdraw = 'Withdraw',
  Transfer = 'Transfer',
  WithdrawHistory = 'WithdrawHistory',
  Support = 'Support',
  Activity = 'Activity',
}

export function RootNavigation() {
  const {loading, magic} = useUserWeb3();
  const {locale, onBoardingDone} = useSettings();

  const {profile, status} = useProfile();
  //

  const isVerified = status === UserStatus.Verified;

  return (
    <>
      {isWeb() ? null : magic ? <magic.Relayer /> : null}
      {isWeb() ? <PwaModal /> : null}
      <RootStack.Navigator screenOptions={{headerShown: false, animationEnabled: true}}>
        {/*<RootStack.Screen name="Test" component={TestScreen} />*/}
        {loading ? (
          <RootStack.Screen name={Routes.Init} options={{title: screenTitle('Loading')}} component={AppLoading} />
        ) : null}
        {!locale ? (
          <RootStack.Screen
            name={Routes.SelectLanguage}
            options={{title: screenTitle('Select Language')}}
            component={SelectLanguage}
          />
        ) : null}
        {!onBoardingDone ? (
          <RootStack.Screen
            name={Routes.Onboarding}
            options={{title: screenTitle('on-boarding')}}
            component={OnboardingSlides}
          />
        ) : null}
        {locale && onBoardingDone && !profile ? <RootStack.Screen name={Routes.Login} component={NoWallet} /> : null}
        {locale && onBoardingDone && profile && !isVerified ? (
          <>
            <RootStack.Screen name={Routes.UnVerifiedProfileStack} component={UnVerifiedUserNavigation} />
          </>
        ) : null}
        {locale && onBoardingDone && profile && isVerified ? (
          <>
            <RootStack.Screen name={Routes.VerifiedProfileTab} component={VerifiedUserNavigation} />
          </>
        ) : null}
        {locale && onBoardingDone && profile ? (
          <>
            {isWeb() ? null : (
              <>
                <RootStack.Screen name={Routes.OfflineMap} component={OfflineMap} />
                <RootStack.Screen name={Routes.SavedAreas} component={SavedAreas} />
              </>
            )}
            <RootStack.Screen name={Routes.Support} component={SupportScreen} />
            <RootStack.Screen name={Routes.SelectLanguage} component={SelectLanguage} />
            <RootStack.Screen name={Routes.Settings} component={SettingsScreen} />
          </>
        ) : null}
      </RootStack.Navigator>
    </>
  );
}

export const analyticsTabEvents = {
  [Routes.MyProfile]: 'my_profile',
  [Routes.GreenBlock]: 'tree_list',
  [Routes.TreeSubmission]: 'add_tree',
};
