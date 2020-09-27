import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Avatar from "./src/components/Avatar";
import Button from "./src/components/Button";
import IconButton from "./src/components/IconButton";
import UserCard from "./src/components/UserCard";
import Spacer from "./src/components/Spacer";
import globalStyles from "./src/styles";
import Steps from "./src/components/Steps";
import OnboardingScreen from "./src/components/OnboardingScreen/OnboardingScreen";
import Router from "./src/screens/Router";

export default function App() {
  const [loaded] = useFonts({
    Montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Light": require("./assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
  });

  if (!loaded) {
    return null;
  }
  const currentStep = 1;

  const atashqal = (
    <View style={styles.container}>
      <Button caption="English" />
      <Spacer />
      <View style={globalStyles.horizontalStack}>
        <IconButton />
        <Spacer />
        <IconButton variant="success" />
      </View>
      <Spacer />

      <Avatar type="active" />
      <Spacer />

      <View style={{ width: 240 }}>
        <UserCard name="Amir Jackson" text="58 trees" />
      </View>
      <Spacer />

      <Steps.Container currentStep={1} style={{ width: 300 }}>
        <Steps.Step step={1}>
          <View style={{ alignItems: "flex-start" }}>
            <Text style={globalStyles.h4}>Trees per voucher</Text>

            <Text style={[globalStyles.normal, globalStyles.pv1]}>
              Total vouchers to distribute
            </Text>

            <Button variant="primary" caption="NEXT" />
          </View>
        </Steps.Step>
        <Steps.Step step={2} lastStep>
          <View style={{ alignItems: "flex-start" }}>
            <Text style={globalStyles.h4}>Trees per voucher</Text>

            <Text style={[globalStyles.normal, globalStyles.pv1]}>
              Total vouchers to distribute
            </Text>

            <Button variant="primary" caption="NEXT" />
          </View>
        </Steps.Step>
      </Steps.Container>
    </View>
  );

  // return atashqal;

  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
