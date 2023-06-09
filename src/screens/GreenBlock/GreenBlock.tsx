import React, {useCallback, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {GreenBlockRouteParamList} from 'types';
import TreeList from 'components/TreeList';
import {Routes, VerifiedUserNavigationProp} from 'navigation/index';
import {screenTitle} from 'utilities/helpers/documentTitle';
import {TreeInventory} from 'screens/GreenBlock/screens/TreeInventory/TreeInventory';
import TreeDetails from './screens/TreeDetails';
import {NotVerifiedTreeDetails} from './screens/TreeDetails/NotVerifiedTreeDetails';
import {useConfig} from 'ranger-redux/modules/web3/web3';

interface Props extends VerifiedUserNavigationProp<Routes.GreenBlock> {}

const Stack = createStackNavigator<GreenBlockRouteParamList>();

function GreenBlock({navigation, route}: Props) {
  const {params} = route;
  const filter = params?.filter || route.params?.filter;
  const tabFilter = params?.tabFilter || route.params?.tabFilter;
  const submittedFilter = params?.submittedFilter || route.params?.submittedFilter;
  const notVerifiedFilter = params?.notVerifiedFilter || route.params?.notVerifiedFilter;

  const {useV1Submission} = useConfig();

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
      {useV1Submission ? (
        <Stack.Screen name={Routes.TreeList}>{props => <TreeList {...props} filter={filter} />}</Stack.Screen>
      ) : (
        <Stack.Screen name={Routes.TreeInventory_V2}>
          {props => (
            <TreeInventory
              {...props}
              filter={{tab: tabFilter, submittedStatus: submittedFilter, notVerifiedStatus: notVerifiedFilter}}
            />
          )}
        </Stack.Screen>
      )}
      <Stack.Screen
        name={Routes.TreeDetails}
        component={TreeDetails}
        options={({route}) => ({title: screenTitle(`Tree ${route.params?.tree_id}`)})}
      />
      <Stack.Screen name={Routes.NotVerifiedTreeDetails} component={NotVerifiedTreeDetails} />
    </Stack.Navigator>
  );
}

export default GreenBlock;
