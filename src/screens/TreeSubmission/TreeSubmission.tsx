import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import globalStyles from 'constants/styles';

import NewTree from './screens/NewTree';
import SelectOnMap from './screens/SelectOnMap';
import SelectPhoto from './screens/SelectPhoto';

const Stack = createStackNavigator();

function TreeSubmission() {
  return (
    <Stack.Navigator
      initialRouteName="SelectOnMap"
      screenOptions={{
        cardStyle: globalStyles.screenView,
        headerShown: false,
      }}
    >
      <Stack.Screen name="SelectPhoto" component={SelectPhoto} />
      <Stack.Screen name="SelectOnMap" component={SelectOnMap} />
      <Stack.Screen name="NewTree" component={NewTree} />
    </Stack.Navigator>
  );
}

export default TreeSubmission;
