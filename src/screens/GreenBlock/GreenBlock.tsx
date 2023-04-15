import React, {useCallback, useEffect} from 'react';
import {GreenBlockRouteParamList} from 'types';
import TreeDetails from './screens/TreeDetails';
import TreeList from 'components/TreeList';
import {Routes, VerifiedUserNavigationProp} from 'navigation/index';
import {screenTitle} from 'utilities/helpers/documentTitle';
import {createStackNavigator} from '@react-navigation/stack';
import {TreeInventory} from 'screens/GreenBlock/screens/TreeInventory/TreeInventory';

interface Props extends VerifiedUserNavigationProp<Routes.GreenBlock> {}

const Stack = createStackNavigator<GreenBlockRouteParamList>();

function GreenBlock({navigation, route}: Props) {
  const {params} = route;
  const filter = params?.filter || route.params?.filter;
  const tabFilter = params?.tabFilter || route.params?.tabFilter;
  const situationFilter = params?.situationFilter || route.params?.situationFilter;

  const shouldNavigateToTree = useCallback(() => {
    if (route.params?.shouldNavigateToTreeDetails) {
      (navigation as any).navigate('MyCommunity', {
        shouldNavigateToTreeDetails: route.params?.shouldNavigateToTreeDetails,
      });
    }
  }, [navigation, route.params]);

  useEffect(() => {
    if (route.params?.shouldNavigateToTreeDetails) {
      shouldNavigateToTree();
    }
  }, [shouldNavigateToTree, route.params]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false, animationEnabled: true}}>
      <Stack.Screen name={Routes.TreeInventory_V2}>
        {props => <TreeInventory {...props} filter={{tab: tabFilter, situation: situationFilter}} />}
      </Stack.Screen>
      <Stack.Screen name={Routes.TreeList}>{props => <TreeList {...props} filter={filter} />}</Stack.Screen>
      <Stack.Screen
        name={Routes.TreeDetails}
        component={TreeDetails}
        options={({route}) => ({title: screenTitle(`Tree ${route.params?.tree_id}`)})}
      />
    </Stack.Navigator>
  );
}

export default GreenBlock;
