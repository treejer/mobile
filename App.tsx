import "./src/globals";
import React from "react";
import { LogBox } from "react-native";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import MainTabs from "./src/screens/MainTabs";
import Web3Provider from "./src/services/web3";

LogBox.ignoreLogs([
  "Warning: The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
  "Warning: The provided value 'ms-stream' is not a valid 'responseType'.",
]);

console.warn = () => {}

function App() {
  const [loaded] = useFonts({
    Montserrat: require("./assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Light": require("./assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
  });

  if (!loaded) {
    return <AppLoading />;
  }

  return (
    <Web3Provider>
      <NavigationContainer>
        {/* <Router /> */}
        <MainTabs />
      </NavigationContainer>
    </Web3Provider>
  );
}

export default App;
