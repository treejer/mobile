import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {View} from 'react-native';

import {Routes} from 'navigation/Navigation';
import {SelectPlantTypeV2} from 'screens/TreeSubmissionV2/screens/SelectPlantTypeV2/SelectPlantTypeV2';
import {SubmitTreeV2} from 'screens/TreeSubmissionV2/screens/SubmitTreeV2/SubmitTreeV2';
import {SelectOnMapV2} from 'screens/TreeSubmissionV2/screens/SelectOnMapV2/SelectOnMapV2';
import {mockPlantTreePermissionsGranted} from 'screens/TreeSubmissionV2/components/__test__/mock';
import {TreeInventory} from 'screens/GreenBlock/screens/TreeInventory/TreeInventory';
import TreeDetails from 'screens/GreenBlock/screens/TreeDetails';
import {NotVerifiedTreeDetails} from 'screens/GreenBlock/screens/TreeDetails/NotVerifiedTreeDetails';

export type TestSubmissionStackProps = {
  name: Routes;
  component: JSX.Element;
  stack?: Routes.TreeSubmission_V2 | Routes.GreenBlock;
};

const RootStack = createStackNavigator();

const SubmissionStack = createStackNavigator();

const GreenBlockStack = createStackNavigator();

export function TestSubmissionStack(props: TestSubmissionStackProps) {
  const {name, stack, component: Component} = props;

  const SubmissionNavigator = () => {
    return (
      <SubmissionStack.Navigator initialRouteName={name}>
        <SubmissionStack.Screen name={Routes.SelectPlantType_V2}>
          {() => (name === Routes.SelectPlantType_V2 ? Component : <SelectPlantTypeV2 />)}
        </SubmissionStack.Screen>
        <SubmissionStack.Screen name={Routes.SubmitTree_V2}>
          {() =>
            name === Routes.SubmitTree_V2 ? (
              Component
            ) : (
              <SubmitTreeV2 plantTreePermissions={mockPlantTreePermissionsGranted} />
            )
          }
        </SubmissionStack.Screen>
        <SubmissionStack.Screen name={Routes.SelectOnMap_V2}>
          {() =>
            name === Routes.SelectOnMap_V2 ? (
              Component
            ) : (
              <SelectOnMapV2 plantTreePermissions={mockPlantTreePermissionsGranted} />
            )
          }
        </SubmissionStack.Screen>
      </SubmissionStack.Navigator>
    );
  };

  const GreenBlockNavigator = () => {
    return (
      <GreenBlockStack.Navigator initialRouteName={name}>
        <GreenBlockStack.Screen name={Routes.TreeInventory_V2}>
          {() => (name === Routes.TreeInventory_V2 ? Component : <TreeInventory />)}
        </GreenBlockStack.Screen>
        <GreenBlockStack.Screen name={Routes.TreeDetails}>
          {() => (name === Routes.TreeDetails ? Component : <TreeDetails />)}
        </GreenBlockStack.Screen>
        <GreenBlockStack.Screen name={Routes.NotVerifiedTreeDetails}>
          {() => (name === Routes.NotVerifiedTreeDetails ? Component : <NotVerifiedTreeDetails />)}
        </GreenBlockStack.Screen>
      </GreenBlockStack.Navigator>
    );
  };

  const Another = () => <View></View>;

  return (
    <RootStack.Navigator initialRouteName={stack}>
      <RootStack.Screen name={Routes.TreeSubmission_V2} component={SubmissionNavigator} />
      <RootStack.Screen name={Routes.GreenBlock} component={GreenBlockNavigator} />
      <RootStack.Screen name="ANOTHER" component={Another} />
    </RootStack.Navigator>
  );
}
