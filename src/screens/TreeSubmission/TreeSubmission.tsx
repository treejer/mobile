import globalStyles from 'constants/styles';

import React, {useEffect} from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {Route, NavigationProp} from '@react-navigation/native';
import {Tree, TreeSubmissionRouteParamList} from 'types';
import {useQuery} from '@apollo/client';
import TreeDetailQuery, {
  TreeDetailQueryQueryData,
} from 'screens/GreenBlock/screens/TreeDetails/graphql/TreeDetailQuery.graphql';

import SubmitTree from './screens/SubmitTree';
import SelectPhoto from './screens/SelectPhoto/SelectPhoto';
import SelectPlantType from 'screens/TreeSubmission/screens/SelectPlantType/SelectPlantType';
import {Routes} from 'navigation';

export type TreeSubmissionStackNavigationProp<T extends keyof TreeSubmissionRouteParamList> = NativeStackNavigationProp<
  TreeSubmissionRouteParamList,
  T
>;

export type TreeSubmissionStackScreenProps<T extends keyof TreeSubmissionRouteParamList> = NativeStackScreenProps<
  TreeSubmissionRouteParamList,
  T
>;

const Stack = createNativeStackNavigator<TreeSubmissionRouteParamList>();

interface Props {
  route: Route<any>;
  navigation: NavigationProp<any>;
}

function TreeSubmission({route, navigation}: Props) {
  // @ts-ignore
  const initRouteName = route.params?.initialRouteName;

  const treeIdToUpdate =
    route.params && 'treeIdToUpdate' in route.params ? ((route.params as any).treeIdToUpdate as string) : undefined;
  const location = route.params && 'location' in route.params ? ((route.params as any).location as any) : undefined;
  const treeIdToPlant =
    route.params && 'treeIdToPlant' in route.params ? ((route.params as any).treeIdToPlant as string) : undefined;
  const tree = route.params && 'tree' in route.params ? ((route.params as any).tree as Tree) : undefined;
  const isSingle = route.params && 'isSingle' in route.params ? ((route.params as any).isSingle as boolean) : undefined;

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
      navigation.navigate(initRouteName, route.params);
    }
  }, [initRouteName, navigation, route.params]);

  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: globalStyles.screenView,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={Routes.SelectPlantType}
        component={SelectPlantType}
        initialParams={{
          journey: {
            treeIdToUpdate,
            location,
            treeIdToPlant,
            tree,
          },
        }}
      />
      <Stack.Screen
        name={Routes.SelectPhoto}
        component={SelectPhoto}
        initialParams={{
          journey: {
            treeIdToUpdate,
            location,
            treeIdToPlant,
            tree,
            isSingle,
          },
        }}
      />
      <Stack.Screen name={Routes.SubmitTree} component={SubmitTree} />
    </Stack.Navigator>
  );
}

export default TreeSubmission;
