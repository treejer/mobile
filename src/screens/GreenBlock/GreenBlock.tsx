import React, {useCallback, useEffect} from 'react';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {GreenBlockRouteParamList, MainTabsParamList} from 'types';
import TreeDetails from './screens/TreeDetails';
import TreeList from 'components/TreeList';
import {Routes} from 'navigation';
import {screenTitle} from 'utilities/helpers/documentTitle';
import {createStackNavigator} from '@react-navigation/stack';

interface Props {
  navigation: NavigationProp<GreenBlockRouteParamList>;
  route: RouteProp<MainTabsParamList, Routes.GreenBlock>;
}

const Stack = createStackNavigator<GreenBlockRouteParamList>();

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
    <Stack.Navigator screenOptions={{headerShown: false, animationEnabled: true}}>
      <Stack.Screen name={Routes.TreeList} options={{title: screenTitle('Tree Inventory')}}>
        {props => <TreeList {...props} filter={filter} />}
      </Stack.Screen>
      <Stack.Screen
        name={Routes.TreeDetails}
        component={TreeDetails}
        options={({route}) => ({title: screenTitle(`Tree ${route.params?.tree_id}`)})}
      />
    </Stack.Navigator>
  );
}

export default GreenBlock;
