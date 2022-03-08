import React, {useCallback, useEffect, useRef} from 'react';
import {Alert} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationProp, RouteProp, useRoute} from '@react-navigation/native';
// import {useQuery} from '@apollo/client';
// import getMeQuery, {GetMeQueryData} from 'services/graphql/GetMeQuery.graphql';
import {GreenBlockRouteParamList, MainTabsParamList} from 'types';

import TreeDetails from './screens/TreeDetails';
import AcceptInvitation from './screens/AcceptInvitation';
import TreeList from 'components/TreeList';
import {useTranslation} from 'react-i18next';

interface Props {
  navigation: NavigationProp<GreenBlockRouteParamList>;
  route: RouteProp<MainTabsParamList, 'GreenBlock'>;
}

const Stack = createNativeStackNavigator<GreenBlockRouteParamList>();

function GreenBlock({navigation, route}: Props) {
  // const {data} = useQuery<GetMeQueryData>(getMeQuery);
  // const isVerified = data?.user?.isVerified;
  const greenBlockIdToJoin = route.params?.greenBlockIdToJoin;
  const alertPending = useRef(false);
  const {t} = useTranslation();

  const {params} = useRoute<RouteProp<MainTabsParamList, 'GreenBlock'>>();
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

  const shouldNavigateToInvitation = useCallback(() => {
    // if (greenBlockIdToJoin && typeof isVerified === 'boolean') {
    //   if (isVerified) {
    //     return true;
    //   } else if (!alertPending.current) {
    //     alertPending.current = true;
    //     Alert.alert(t('greenBlock.notVerified.title'), t('greenBlock.notVerified.details'), [
    //       {
    //         text: t('getVerified'),
    //         onPress: () => {
    //           alertPending.current = false;
    //           navigation.navigate('VerifyProfile' as any);
    //         },
    //       },
    //     ]);
    //   }
    // }

    return false;
  }, [greenBlockIdToJoin, navigation, t]);

  useEffect(() => {
    if (shouldNavigateToInvitation()) {
      navigation.navigate('AcceptInvitation', {greenBlockId: route.params.greenBlockIdToJoin});
    }
  }, [shouldNavigateToInvitation, navigation, route.params]);

  const initialRouteName = shouldNavigateToInvitation() ? 'AcceptInvitation' : 'TreeList';

  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={initialRouteName}>
      <Stack.Screen name="TreeList">{props => <TreeList {...props} filter={filter} />}</Stack.Screen>
      <Stack.Screen name="TreeDetails" component={TreeDetails} />
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
