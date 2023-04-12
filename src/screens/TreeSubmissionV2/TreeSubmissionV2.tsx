import React, {useEffect} from 'react';
import {Route, NavigationProp} from '@react-navigation/native';
import {useQuery} from '@apollo/client';
import {createStackNavigator, StackNavigationProp, StackScreenProps} from '@react-navigation/stack';

import {Routes} from 'navigation/index';
import {TreeSubmissionRouteParamList} from 'types';
import {useCurrentJourney} from 'services/currentJourney';
import {screenTitle} from 'utilities/helpers/documentTitle';
import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {isWeb} from 'utilities/helpers/web';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {useOfflineMap} from 'ranger-redux/modules/offlineMap/offlineMap';
import {CheckOfflineMaps} from 'screens/TreeSubmission/components/CheckPermissions/CheckOfflineMaps';
import {SubmitTreeV2} from 'screens/TreeSubmissionV2/screens/SubmitTreeV2/SubmitTreeV2';
import {SelectPlantTypeV2} from 'screens/TreeSubmissionV2/screens/SelectPlantTypeV2/SelectPlantTypeV2';
import TreeDetailQuery, {
  TreeDetailQueryQueryData,
} from 'screens/GreenBlock/screens/TreeDetails/graphql/TreeDetailQuery.graphql';
import {SelectOnMapV2} from 'screens/TreeSubmissionV2/screens/SelectOnMapV2/SelectOnMapV2';

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

function TreeSubmissionV2({route, navigation, plantTreePermissions}: Props) {
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
    if (initRouteName && initRouteName !== Routes.SelectPlantType_V2) {
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
          name={Routes.SelectPlantType_V2}
          options={{title: screenTitle('Select Type')}}
          component={CheckOfflineMaps}
        />
        <Stack.Screen
          name={Routes.SubmitTree_V2}
          options={{title: screenTitle('Submit Tree')}}
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
      <Stack.Screen name={Routes.SelectPlantType_V2} options={{title: screenTitle('Plant Type')}}>
        {() => <SelectPlantTypeV2 />}
      </Stack.Screen>
      <Stack.Screen name={Routes.SubmitTree_V2} options={{title: screenTitle('Submit Tree')}}>
        {() => <SubmitTreeV2 plantTreePermissions={plantTreePermissions} />}
      </Stack.Screen>
      <Stack.Screen name={Routes.SelectOnMap_V2} options={{title: screenTitle('Select On Map')}}>
        {() => <SelectOnMapV2 plantTreePermissions={plantTreePermissions} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default TreeSubmissionV2;
