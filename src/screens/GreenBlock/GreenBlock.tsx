import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import CreateGreenBlock from './screens/CreateGreenBlock';
import MyCommunity from './screens/MyCommunity';
import TreeDetails from './screens/TreeDetails';
import {TreesQueryQueryData} from './screens/MyCommunity/graphql/TreesQuery.graphql';

export type GreenBlockRouteParamList = {
  CreateGreenBlock: undefined;
  MyCommunity: undefined;
  TreeDetails: {
    tree: TreesQueryQueryData.TreesTreesData;
  };
};

const Stack = createStackNavigator<GreenBlockRouteParamList>();

function GreenBlock() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="MyCommunity" component={MyCommunity} />
      <Stack.Screen name="TreeDetails" component={TreeDetails} />
      <Stack.Screen name="CreateGreenBlock" component={CreateGreenBlock} />
    </Stack.Navigator>
  );
}

export default GreenBlock;
