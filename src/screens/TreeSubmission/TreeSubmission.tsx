import globalStyles from 'constants/styles';

import React, {useEffect} from 'react';
import {Route, NavigationProp} from '@react-navigation/native';
import {TreeSubmissionRouteParamList} from 'types';
import {useQuery} from '@apollo/client';
import TreeDetailQuery, {
  TreeDetailQueryQueryData,
} from 'screens/GreenBlock/screens/TreeDetails/graphql/TreeDetailQuery.graphql';

import SubmitTree from './screens/SubmitTree';
import SelectPhoto from './screens/SelectPhoto/SelectPhoto';
import SelectPlantType from 'screens/TreeSubmission/screens/SelectPlantType/SelectPlantType';
import {Routes} from 'navigation';
import {useCurrentJourney} from 'services/currentJourney';
import SelectOnMap from 'screens/TreeSubmission/screens/SelectOnMap';
import {screenTitle} from 'utilities/helpers/documentTitle';
import {createStackNavigator, StackNavigationProp, StackScreenProps} from '@react-navigation/stack';

export type TreeSubmissionStackNavigationProp<T extends keyof TreeSubmissionRouteParamList> = StackNavigationProp<
  TreeSubmissionRouteParamList,
  T
>;

export type TreeSubmissionStackScreenProps<T extends keyof TreeSubmissionRouteParamList> = StackScreenProps<
  TreeSubmissionRouteParamList,
  T
>;

const Stack = createStackNavigator<TreeSubmissionRouteParamList>();

interface Props {
  route: Route<any>;
  navigation: NavigationProp<any>;
}

function TreeSubmission({route, navigation}: Props) {
  // @ts-ignore
  const initRouteName = route.params?.initialRouteName;
  const {journey} = useCurrentJourney();

  const treeIdToPlant = journey && 'treeIdToPlant' in journey ? ((journey as any).treeIdToPlant as string) : undefined;

  // this if added to get query to assignedTree works well on submit tree
  if (typeof treeIdToPlant != 'undefined') {
    useQuery<TreeDetailQueryQueryData, TreeDetailQueryQueryData.Variables>(TreeDetailQuery, {
      variables: {
        id: treeIdToPlant, //todo fix it
      },
    });
  }

  useEffect(() => {
    if (initRouteName && initRouteName !== Routes.SelectPlantType) {
      navigation.navigate(initRouteName);
    }
  }, [initRouteName, navigation, route.params]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen
        name={Routes.SelectPlantType}
        component={SelectPlantType}
        options={{title: screenTitle('Plant Type')}}
      />
      <Stack.Screen name={Routes.SelectPhoto} component={SelectPhoto} options={{title: screenTitle('Photo')}} />
      <Stack.Screen name={Routes.SelectOnMap} component={SelectOnMap} options={{title: screenTitle('Location')}} />
      <Stack.Screen name={Routes.SubmitTree} component={SubmitTree} options={{title: screenTitle('Submit Tree')}} />
    </Stack.Navigator>
  );
}

export default TreeSubmission;
