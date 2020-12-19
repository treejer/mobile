import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import globalStyles from 'constants/styles';

import SubmitTree from './screens/SubmitTree';
import SelectOnMap from './screens/SelectOnMap';
import SelectPhoto from './screens/SelectPhoto';
import {TreeJourney} from './types';
import {Route} from '@react-navigation/native';

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

interface Props {
  route: Route<'TreeUpdate'>;
}

function TreeSubmission({route}: Props) {
  const treeIdToUpdate =
    route.params && 'treeIdToUpdate' in route.params ? ((route.params as any).treeIdToUpdate as string) : undefined;

  return (
    <Stack.Navigator
      initialRouteName="SelectPhoto"
      screenOptions={{
        cardStyle: globalStyles.screenView,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="SelectPhoto"
        component={SelectPhoto}
        initialParams={{
          journey: treeIdToUpdate
            ? {
                treeIdToUpdate,
              }
            : undefined,
        }}
      />
      <Stack.Screen name="SelectOnMap" component={SelectOnMap} />
      <Stack.Screen name="SubmitTree" component={SubmitTree} />
    </Stack.Navigator>
  );
}

export default TreeSubmission;
