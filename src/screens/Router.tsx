import globalStyles from 'constants/styles';

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from 'screens/Onboarding/screens/OnboardingSlides';

import Welcome from './Onboarding/screens/SelectLanguage';
import SignUp from './SignUp';

const Stack = createNativeStackNavigator();

function Router() {
  return (
    <Stack.Navigator
      screenOptions={{contentStyle: globalStyles.screenView}}
      defaultScreenOptions={{headerShown: false}}
    >
      <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{headerShown: false}} />
      <Stack.Screen name="SignUp" component={SignUp} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

export default Router;
