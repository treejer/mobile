import React from 'react';
import {AppLoading} from 'components/AppLoading/AppLoading';
import {useWeb3Context} from 'services/web3';
import {isWeb} from 'utilities/helpers/web';
import {useSettings} from 'services/settings';
import NoWallet from 'screens/Profile/screens/NoWallet/NoWallet';
import SelectLanguage from 'screens/Onboarding/screens/SelectLanguage/SelectLanguage';
import OnboardingSlides from 'screens/Onboarding/screens/OnboardingSlides/OnboardingSlides';
import {useCurrentUser, UserStatus} from 'services/currentUser';
import {VerifiedUserNavigation} from './VerifiedUser';
import {UnVerifiedUserNavigation} from './UnVerifiedUser';
import OfflineMap from 'screens/Profile/screens/OfflineMap/OfflineMap';
import SavedAreas from 'screens/Profile/screens/SavedAreas/SavedAreas';
import SettingsScreen from 'screens/Profile/screens/Settings/SettingsScreen';
import PwaModal from 'components/PwaModal/PwaModal';
import {screenTitle} from 'utilities/helpers/documentTitle';
import {createStackNavigator, StackScreenProps as LibraryProp} from '@react-navigation/stack';

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
  Test = 'Test',
  SelectPhoto = 'SelectPhoto',
  SelectPlantType = 'SelectPlantType',
  SubmitTree = 'SubmitTree',
  TreeList = 'TreeList',
  TreeDetails = 'TreeDetails',
  Organization = 'Organization',
  CheckPermissions = 'CheckPermissions',
}

export function RootNavigation() {
  const {loading, magic} = useWeb3Context();
  const {locale, onboardingDone} = useSettings();

  const {
    data: {user},
    status,
  } = useCurrentUser();

  const isVerified = status === UserStatus.Verified;

  return (
    <>
      {isWeb() ? null : magic ? <magic.Relayer /> : null}
      {isWeb() ? <PwaModal /> : null}
      <RootStack.Navigator screenOptions={{headerShown: false, animationEnabled: true}}>
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
        {!onboardingDone ? (
          <RootStack.Screen
            name={Routes.Onboarding}
            options={{title: screenTitle('on-boarding')}}
            component={OnboardingSlides}
          />
        ) : null}
        {locale && onboardingDone && !user ? <RootStack.Screen name={Routes.Login} component={NoWallet} /> : null}
        {locale && onboardingDone && user && !isVerified ? (
          <>
            <RootStack.Screen name={Routes.UnVerifiedProfileStack} component={UnVerifiedUserNavigation} />
          </>
        ) : null}
        {locale && onboardingDone && user && isVerified ? (
          <>
            <RootStack.Screen name={Routes.VerifiedProfileTab} component={VerifiedUserNavigation} />
          </>
        ) : null}
        {locale && onboardingDone && user ? (
          <>
            {isWeb() ? null : (
              <>
                <RootStack.Screen name={Routes.OfflineMap} component={OfflineMap} />
                <RootStack.Screen name={Routes.SavedAreas} component={SavedAreas} />
              </>
            )}
            <RootStack.Screen
              name={Routes.SelectLanguage}
              component={SelectLanguage}
              options={{title: screenTitle('Select Language')}}
            />
            <RootStack.Screen
              name={Routes.Settings}
              component={SettingsScreen}
              options={{title: screenTitle('Settings')}}
            />
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
