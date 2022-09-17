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
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';

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
