import {useEffect, useState} from 'react';
import {Linking, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from 'services/config';

export function useInitialDeepLinking() {
  useEffect(() => {
    (async () => {
      try {
        // Get the deep link used to open the app
        const initialUrl = await Linking.getInitialURL();
        console.log(initialUrl, 'initialUrl');
        if (initialUrl) {
          const {action, value} = convertUrlParams(initialUrl);
          if (action === 'organization') {
            await AsyncStorage.setItem(deepLinkingKey('organization'), value);
            await AsyncStorage.removeItem(deepLinkingKey('referrer'));
          } else {
            await AsyncStorage.setItem(deepLinkingKey('referrer'), value);
            await AsyncStorage.removeItem(deepLinkingKey('organization'));
          }
        }
      } catch (e) {
        console.log(e, 'useInitialDeepLinking');
      }
    })();
  }, []);

  useEffect(() => {
    Linking.addEventListener('url', onReceiveURL);

    return () => {
      Linking.removeEventListener('url', onReceiveURL);
    };
  }, []);

  const onReceiveURL = async ({url}) => {
    console.log(url, '<==============');
    const {action, value} = convertUrlParams(url);
    try {
      if (action === 'organization') {
        await AsyncStorage.setItem(deepLinkingKey('organization'), value);
        await AsyncStorage.removeItem(deepLinkingKey('referrer'));
      } else {
        await AsyncStorage.setItem(deepLinkingKey('referrer'), value);
        await AsyncStorage.removeItem(deepLinkingKey('organization'));
      }
    } catch (e) {
      console.log(e, 'e inside useDeepLinking');
    }
  };
}

export default function useRefer() {
  const [referrer, setReferrer] = useState(null);
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    (async function () {
      Linking.addEventListener('url', onReceiveURL);
      await setRefers();
    })();

    return () => {
      Linking.removeEventListener('url', onReceiveURL);
    };
  }, []);

  const setRefers = async () => {
    try {
      const _referrer = await AsyncStorage.getItem(deepLinkingKey('referrer'));
      setReferrer(_referrer);
      const _organization = await AsyncStorage.getItem(deepLinkingKey('organization'));
      setOrganization(_organization);
    } catch (e) {
      console.log(e, 'useRefer > setRefers: Error');
    }
  };

  const onReceiveURL = async ({url}) => {
    console.log(url, 'onreceive url');
    const {action, value} = convertUrlParams(url);
    if (action === 'referrer') {
      setReferrer(value);
      setOrganization(null);
    } else {
      setOrganization(value);
      setReferrer(null);
    }
  };

  return {referrer, organization};
}

export function deepLinkingKey(action) {
  return `deepLinking-${action}`;
}

export function convertUrlParams(url: string) {
  const baseUrl = Platform.OS === 'android' ? `${config.rangerUrl}/` : 'treejer-ranger://';
  const [action, value] = url?.replace(baseUrl, '')?.split('/');
  return {action, value};
}

export async function getDeepLikingValues(): Promise<{referrer?: string; organization?: string}> {
  try {
    const referrer = await AsyncStorage.getItem(deepLinkingKey('referrer'));
    const organization = await AsyncStorage.getItem(deepLinkingKey('organization'));

    return {referrer, organization};
  } catch (e) {
    console.log(e, 'e inside getDeepLikingValues');
  }
}
