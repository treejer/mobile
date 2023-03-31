import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Routes} from 'navigation/Navigation';
import {SelectPlantTypeV2} from 'screens/TreeSubmissionV2/screens/SelectPlantTypeV2/SelectPlantTypeV2';
import {SubmitTreeV2} from 'screens/TreeSubmissionV2/screens/SubmitTreeV2/SubmitTreeV2';
import {mockPlantTreePermissionsGranted} from 'screens/TreeSubmissionV2/components/__test__/mock';

export type TestSubmissionStackProps = {
  name: Routes;
  component: JSX.Element;
};

const Stack = createStackNavigator();

export function TestSubmissionStack(props: TestSubmissionStackProps) {
  const {name, component: Component} = props;

  return (
    <Stack.Navigator>
      <Stack.Screen name={Routes.SelectPlantType_V2}>
        {() => (name === Routes.SelectPlantType_V2 ? Component : <SelectPlantTypeV2 />)}
      </Stack.Screen>
      <Stack.Screen name={Routes.SubmitTree_V2}>
        {() =>
          name === Routes.SubmitTree_V2 ? (
            Component
          ) : (
            <SubmitTreeV2 plantTreePermissions={mockPlantTreePermissionsGranted} />
          )
        }
      </Stack.Screen>
    </Stack.Navigator>
  );
}
