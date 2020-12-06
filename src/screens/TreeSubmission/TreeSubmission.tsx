import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import globalStyles from 'constants/styles';

import SubmitTree from './screens/SubmitTree';
import SelectOnMap from './screens/SelectOnMap';
import SelectPhoto from './screens/SelectPhoto';
import {TreeJourney} from './types';

export type TreeSubmissionRouteParamList = {
  SelectPhoto: {
    journey: TreeJourney;
  };
  SelectOnMap: {
    journey: TreeJourney;
  };
  SubmitTree: {
    journey: TreeJourney;
  };
};

const Stack = createStackNavigator<TreeSubmissionRouteParamList>();

function TreeSubmission() {
  return (
    <Stack.Navigator
      initialRouteName="SelectPhoto"
      screenOptions={{
        cardStyle: globalStyles.screenView,
        headerShown: false,
      }}
    >
      <Stack.Screen name="SelectPhoto" component={SelectPhoto} />
      <Stack.Screen name="SelectOnMap" component={SelectOnMap} />
      <Stack.Screen name="SubmitTree" component={SubmitTree} />
    </Stack.Navigator>
  );
}

export default TreeSubmission;
