import './src/globals';
import React from 'react';
import {LogBox} from 'react-native';
import {AppLoading} from 'expo';
import {useFonts} from 'expo-font';
import {NavigationContainer} from '@react-navigation/native';
import MainTabs from './src/screens/MainTabs';
import Web3Provider, {usePersistedWallet} from './src/services/web3';
import AuthProvider, {usePersistedUserData} from './src/services/auth';
// import PasswordProtected from './src/screens/PasswordProtected';

LogBox.ignoreLogs([
  "Warning: The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
  "Warning: The provided value 'ms-stream' is not a valid 'responseType'.",
  "Warning: No means to retreive",
]);

function App() {
  const [fontsLoaded] = useFonts({
    Montserrat: require('./assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf'),
    'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
  });
  const [userDataLoaded, userData] = usePersistedUserData();
  const [privateKeyLoaded, privateKey] = usePersistedWallet();

  if (!fontsLoaded || !userDataLoaded || !privateKeyLoaded) {
    return <AppLoading />;
  }

  return (
    <AuthProvider userData={userData}>
      <Web3Provider privateKey={privateKey}>
        {/* <PasswordProtected privateKeyExists={privateKeyExists}> */}
          <NavigationContainer>
            {/* <Router /> */}
            <MainTabs />
          </NavigationContainer>
        {/* </PasswordProtected> */}
      </Web3Provider>
    </AuthProvider>
  );
}

export default App;
