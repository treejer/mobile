import React, {useEffect} from 'react';
import {Route, NavigationProp} from '@react-navigation/native';
import {useQuery} from '@apollo/client';
import {createStackNavigator, StackNavigationProp, StackScreenProps} from '@react-navigation/stack';

import {Routes} from 'navigation/index';
import {TreeSubmissionRouteParamList} from 'types';
import SubmitTree from './screens/SubmitTree';
import SelectPhoto from './screens/SelectPhoto/SelectPhoto';
import SelectPlantType from 'screens/TreeSubmission/screens/SelectPlantType/SelectPlantType';
import SelectOnMap from 'screens/TreeSubmission/screens/SelectOnMap';
import {SelectModels} from 'screens/TreeSubmission/screens/SelectModels/SelectModels';
import TreeDetailQuery, {
  TreeDetailQueryQueryData,
} from 'screens/GreenBlock/screens/TreeDetails/graphql/TreeDetailQuery.graphql';
import {useCurrentJourney} from 'services/currentJourney';
import {screenTitle} from 'utilities/helpers/documentTitle';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {CreateModel} from 'screens/TreeSubmission/screens/SelectModels/CreateModel';

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
  plantTreePermissions: TUsePlantTreePermissions;
}

function TreeSubmission({route, navigation, plantTreePermissions}: Props) {
  // @ts-ignore
  const initRouteName = route.params?.initialRouteName;
  const {journey} = useCurrentJourney();

  const treeIdToPlant = journey && 'treeIdToPlant' in journey ? ((journey as any).treeIdToPlant as string) : undefined;

  // this if added to get query to assignedTree works well on submit tree
  if (typeof treeIdToPlant != 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
      <Stack.Screen name={Routes.SelectPlantType} options={{title: screenTitle('Plant Type')}}>
        {props => <SelectPlantType {...props} plantTreePermissions={plantTreePermissions} />}
      </Stack.Screen>
      <Stack.Screen name={Routes.SelectModels} options={{title: screenTitle('Select Models')}}>
        {props => <SelectModels {...props} plantTreePermissions={plantTreePermissions} />}
      </Stack.Screen>
      <Stack.Screen name={Routes.CreateModel} options={{title: screenTitle('Create Models')}}>
        {props => <CreateModel {...props} plantTreePermissions={plantTreePermissions} />}
      </Stack.Screen>
      <Stack.Screen name={Routes.SelectPhoto} options={{title: screenTitle('Photo')}}>
        {props => <SelectPhoto {...props} plantTreePermissions={plantTreePermissions} />}
      </Stack.Screen>
      <Stack.Screen name={Routes.SelectOnMap} options={{title: screenTitle('Location')}}>
        {props => <SelectOnMap {...props} plantTreePermissions={plantTreePermissions} />}
      </Stack.Screen>
      <Stack.Screen name={Routes.SubmitTree} options={{title: screenTitle('Submit Tree')}}>
        {props => <SubmitTree {...props} plantTreePermissions={plantTreePermissions} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default TreeSubmission;
