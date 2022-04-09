import React, {useCallback, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {GreenBlockRouteParamList, MainTabsParamList} from 'types';
import TreeDetails from './screens/TreeDetails';
import AcceptInvitation from './screens/AcceptInvitation';
import TreeList from 'components/TreeList';
import {Routes} from 'navigation';

interface Props {
  navigation: NavigationProp<GreenBlockRouteParamList>;
  route: RouteProp<MainTabsParamList, Routes.GreenBlock>;
}

const Stack = createNativeStackNavigator<GreenBlockRouteParamList>();

function GreenBlock({navigation, route}: Props) {
  const {params} = route;
  const filter = params?.filter || route.params?.filter;

  const shouldNavigateToTree = useCallback(() => {
    if (route.params?.shouldNavigateToTreeDetails) {
      navigation.navigate('MyCommunity', {shouldNavigateToTreeDetails: route.params?.shouldNavigateToTreeDetails});
    }
  }, [navigation, route.params]);

  useEffect(() => {
    if (route.params?.shouldNavigateToTreeDetails) {
      shouldNavigateToTree();
    }
  }, [shouldNavigateToTree, route.params]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={Routes.TreeList}>{props => <TreeList {...props} filter={filter} />}</Stack.Screen>
      <Stack.Screen name={Routes.TreeDetails} component={TreeDetails} />
      <Stack.Screen
        name="AcceptInvitation"
        component={AcceptInvitation}
        initialParams={{
          greenBlockId: route.params?.greenBlockIdToJoin,
        }}
      />
    </Stack.Navigator>
  );
}

export default GreenBlock;
