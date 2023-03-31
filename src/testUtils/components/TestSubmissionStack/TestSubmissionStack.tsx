import React from 'react';
import {Routes} from 'navigation/Navigation';
import {createStackNavigator} from '@react-navigation/stack';
import SelectPlantTypeV2 from 'screens/TreeSubmissionV2/screens/SelectPlantTypeV2';
import TestScreen from 'screens/TestScreen';

export type TestSubmissionStackProps = {
  name: Omit<Routes, 'SubmitTreeV2' | 'SelectPlantTypeV2'>;
  component: React.FC;
};

const Stack = createStackNavigator();

export function TestSubmissionStack(props: TestSubmissionStackProps) {
  const {name, component} = props;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={Routes.SelectPlantTypeV2}
        component={name === Routes.SelectPlantTypeV2 ? component : SelectPlantTypeV2}
      />
      <Stack.Screen name={Routes.SubmitTreeV2} component={name === Routes.SubmitTreeV2 ? component : TestScreen} />
    </Stack.Navigator>
  );
}
