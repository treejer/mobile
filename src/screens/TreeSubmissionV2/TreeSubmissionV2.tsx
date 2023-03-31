import React, {useEffect} from 'react';
import {Route, NavigationProp} from '@react-navigation/native';
import {useQuery} from '@apollo/client';
import {createStackNavigator, StackNavigationProp, StackScreenProps} from '@react-navigation/stack';

import {Routes} from 'navigation/index';
import {TreeSubmissionRouteParamList} from 'types';
import SelectPlantTypeV2 from 'screens/TreeSubmissionV2/screens/SelectPlantTypeV2/SelectPlantTypeV2';
import TreeDetailQuery, {
  TreeDetailQueryQueryData,
} from 'screens/GreenBlock/screens/TreeDetails/graphql/TreeDetailQuery.graphql';
import {useCurrentJourney} from 'services/currentJourney';
import {screenTitle} from 'utilities/helpers/documentTitle';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {isWeb} from 'utilities/helpers/web';
import {useOfflineMap} from 'ranger-redux/modules/offlineMap/offlineMap';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {CheckOfflineMaps} from 'screens/TreeSubmission/components/CheckPermissions/CheckOfflineMaps';
import TestScreen from 'screens/TestScreen';

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

function TreeSubmissionV2({route, navigation}: Props) {
  // @ts-ignore
  const initRouteName = route.params?.initialRouteName;
  const {journey} = useCurrentJourney();

  const {packs} = useOfflineMap();
  const isConnected = useNetInfoConnected();

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

  if (!isWeb() && !isConnected && packs?.length === 0) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        <Stack.Screen
          name={Routes.SelectPlantTypeV2}
          options={{title: screenTitle('Select Type')}}
          component={CheckOfflineMaps}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name={Routes.SelectPlantTypeV2} options={{title: screenTitle('Plant Type')}}>
        {() => <SelectPlantTypeV2 />}
      </Stack.Screen>
      <Stack.Screen name={Routes.SubmitTreeV2} options={{title: screenTitle('Submit Tree')}}>
        {() => <TestScreen />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default TreeSubmissionV2;
