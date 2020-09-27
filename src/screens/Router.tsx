import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import OnboardingScreen from "../components/OnboardingScreen";

const Stack = createStackNavigator();

function Router() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default Router;
