import React, {useEffect} from 'react';
import {Alert, Linking} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationProp} from '@react-navigation/native';
import TabBar from 'components/TabBar';
import {usePrivateKeyStorage} from 'services/web3';
import {useCurrentUser, UserStatus} from 'services/currentUser';
import {MainTabsParamList} from 'types';

import TreeSubmission from './TreeSubmission';
import Profile from './Profile';
import GreenBlock from './GreenBlock';

const Tab = createBottomTabNavigator();

interface Props {
  navigation?: NavigationProp<MainTabsParamList>;
}

function MainTabs({navigation}: Props) {
  const {unlocked} = usePrivateKeyStorage();
  const {status} = useCurrentUser();

  const tabsVisible = unlocked && status === UserStatus.Verified;

  useEffect(() => {
    if (!navigation) {
      return;
    }
    const greenBlockRegex = /\/invite\/green-block\/(\d+)$/;
    const listener = (eventOrUrl: string | {url: string}) => {
      if (!eventOrUrl) {
        return;
      }

      const url = typeof eventOrUrl === 'string' ? eventOrUrl : eventOrUrl.url;
      const matches = url.match(greenBlockRegex);

      if (matches) {
        if (!tabsVisible) {
          Alert.alert('You need to create a wallet before joining a green block.');
          return;
        }
        const [, greenBlockIdToJoin] = matches;
        navigation.navigate('GreenBlock', {
          greenBlockIdToJoin,
        });
      }
    };

    Linking.addEventListener('url', listener);
    Linking.getInitialURL()
      .then(listener)
      .catch(error => {
        console.warn('Failed to get initial URL', error);
      });

    return () => {
      Linking.removeEventListener('url', listener);
    };
  }, [navigation, tabsVisible]);

  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        tabBarVisible: tabsVisible,
      }}
      // initialRouteName="GreenBlock"
    >
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="TreeSubmission" component={TreeSubmission} />
      <Tab.Screen name="GreenBlock" component={GreenBlock} />
    </Tab.Navigator>
  );
}

export default MainTabs;
