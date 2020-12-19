import React, {useCallback, useEffect, useRef} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {useQuery} from '@apollo/react-hooks';

import {MainTabsParamList} from 'screens/MainTabs';
import getMeQuery, {GetMeQueryData} from 'services/graphql/GetMeQuery.graphql';

import CreateGreenBlock from './screens/CreateGreenBlock';
import MyCommunity from './screens/MyCommunity';
import TreeDetails from './screens/TreeDetails';
import AcceptInvitation from './screens/AcceptInvitation';
import {TreesQueryQueryData} from './screens/MyCommunity/graphql/TreesQuery.graphql';
import {Alert} from 'react-native';
import TreeSubmission from 'screens/TreeSubmission';

export type GreenBlockRouteParamList = {
  CreateGreenBlock: undefined;
  MyCommunity: undefined;
  AcceptInvitation: {
    greenBlockId: string;
  };
  TreeDetails: {
    tree: TreesQueryQueryData.TreesTreesData;
  };
  TreeUpdate: {
    treeIdToUpdate: string;
  };
};

interface Props {
  navigation: NavigationProp<GreenBlockRouteParamList>;
  route: RouteProp<MainTabsParamList, 'GreenBlock'>;
}

const Stack = createStackNavigator<GreenBlockRouteParamList>();

function GreenBlock({navigation, route}: Props) {
  const {data} = useQuery<GetMeQueryData>(getMeQuery, {
    fetchPolicy: 'cache-and-network',
  });
  const isVerified = data.me?.isVerified;
  const greenBlockIdToJoin = route.params?.greenBlockIdToJoin;
  const alertPending = useRef(false);

  const shouldNavigateToInvitation = useCallback(() => {
    if (greenBlockIdToJoin && typeof isVerified === 'boolean') {
      if (isVerified) {
        return true;
      } else if (!alertPending.current) {
        alertPending.current = true;
        Alert.alert('Please verify your account', 'You must verify your account before joining a green block.', [
          {
            text: 'Get verified',
            onPress: () => {
              alertPending.current = false;
              navigation.navigate('VerifyProfile' as any);
            },
          },
        ]);
      }
    }

    return false;
  }, [greenBlockIdToJoin, isVerified]);

  useEffect(() => {
    if (shouldNavigateToInvitation()) {
      navigation.navigate('AcceptInvitation', {greenBlockId: route.params.greenBlockIdToJoin});
    }
  }, [shouldNavigateToInvitation]);

  const initialRouteName = shouldNavigateToInvitation() ? 'AcceptInvitation' : undefined;

  return (
    <Stack.Navigator headerMode="none" initialRouteName={initialRouteName}>
      <Stack.Screen name="MyCommunity" component={MyCommunity} />
      <Stack.Screen name="TreeDetails" component={TreeDetails} />
      <Stack.Screen name="CreateGreenBlock" component={CreateGreenBlock} />
      <Stack.Screen name="TreeUpdate" component={TreeSubmission} />
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
