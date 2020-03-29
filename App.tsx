import * as React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './components/HomeScreen';

const Stack = createStackNavigator();

function App() {
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      await Font.loadAsync({
        // Load a font `Montserrat` from a static resource
        Montserrat: {
          uri: require('./assets/fonts/Montserrat-Regular.ttf'),
          display: Font.FontDisplay.AUTO
        },
        'Montserrat-SemiBold': {
          uri: require('./assets/fonts/Montserrat-SemiBold.ttf'),
          display: Font.FontDisplay.FALLBACK,
        },
        'Montserrat-Bold': {
          uri: require('./assets/fonts/Montserrat-Bold.ttf'),
        },
        'Montserrat-Light': {
          uri: require('./assets/fonts/Montserrat-Light.ttf'),
        },
      });
      setLoaded(true);
    })();
  }, []);

  return (
    loaded ?
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
      : <View><Text>Loading</Text></View>
  );
}

export default App;