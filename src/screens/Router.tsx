import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import OnboardingScreen from 'screens/Onboarding/screens/OnboardingSlides';
import Welcome from './Onboarding/screens/SelectLanguage';
import SignUp from './SignUp';
import globalStyles from 'constants/styles';

const Stack = createStackNavigator();

function Router() {
  return (
    <Stack.Navigator screenOptions={{cardStyle: globalStyles.screenView}}>
      <Stack.Screen name="Welcome" component={Welcome} options={{headerShown: false}} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{headerShown: false}} />
      <Stack.Screen name="SignUp" component={SignUp} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

export default Router;
