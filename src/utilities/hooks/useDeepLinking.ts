import {useEffect, useState} from 'react';
import {Linking, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isProd, rangerDevUrl, rangerUrl} from 'services/config';
import {EmitterSubscription} from 'react-native/Libraries/vendor/emitter/EventEmitter';

export function useInitialDeepLinking() {
  useEffect(() => {
    (async () => {
      try {
        // Get the deep link used to open the app
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          await updateStorage(initialUrl);
        }
      } catch (e) {
        console.log(e, 'useInitialDeepLinking');
      }
    })();
  }, []);

  useEffect(() => {
    const listener = Linking.addEventListener('url', onReceiveURL);

    return () => {
      listener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onReceiveURL = async ({url}) => {
    try {
      await updateStorage(url);
    } catch (e) {
      console.log(e, 'e inside useDeepLinking');
    }
  };

  const updateStorage = async url => {
    const {action, value} = convertUrlParams(url);

    if (action === 'organization') {
      await AsyncStorage.setItem(deepLinkingKey('organization'), value);
      await AsyncStorage.removeItem(deepLinkingKey('referrer'));
    } else if (action === 'referrer') {
      await AsyncStorage.setItem(deepLinkingKey('referrer'), value);
      await AsyncStorage.removeItem(deepLinkingKey('organization'));
    } else if (action === 'oauth') {
      await AsyncStorage.setItem(deepLinkingKey('oauth'), value);
    }
  };
}

export default function useDeepLinkingValue() {
  const [referrer, setReferrer] = useState<string | null>(null);
  const [organization, setOrganization] = useState<string | null>(null);
  const [oauthProvider, setOauthProvider] = useState<string | null>(null);

  useEffect(() => {
    let listener: EmitterSubscription;
    (async function () {
      listener = Linking.addEventListener('url', onReceiveURL);
      await setCachedValues();
    })();

    return () => {
      listener?.remove();
    };
  }, []);

  const setCachedValues = async () => {
    try {
      const _referrer = await AsyncStorage.getItem(deepLinkingKey('referrer'));
      setReferrer(_referrer);
      const _organization = await AsyncStorage.getItem(deepLinkingKey('organization'));
      setOrganization(_organization);

      const _oauthProvider = await AsyncStorage.getItem(deepLinkingKey('oauth'));
      setOauthProvider(_oauthProvider);
    } catch (e) {
      console.log(e, 'useDeepLinkingValue > setCachedValues: Error');
    }
  };

  const onReceiveURL = async ({url}) => {
    const {action, value} = convertUrlParams(url);
    if (action === 'referrer') {
      setReferrer(value);
      setOrganization(null);
    } else if (action === 'organization') {
      setOrganization(value);
      setReferrer(null);
    } else if (action === 'oauth') {
      setOauthProvider(value);
    }
  };

  const hasRefer = referrer || organization;

  return {referrer, organization, hasRefer, oauthProvider};
}

export function deepLinkingKey(action) {
  return `deepLinking-${action}`;
}

export const deepLinkingUriSchema = 'ranger-treejer://';

export function convertUrlParams(url: string) {
  const baseUrl = Platform.select({
    ios: 'treejer-ranger://',
    android: rangerUrl,
    web: isProd ? rangerUrl : rangerDevUrl,
    default: rangerUrl,
  });

  if (url.includes(`${deepLinkingUriSchema}oauth`)) {
    const [action, value] = url?.replace(deepLinkingUriSchema, '')?.split('/');
    return {
      action,
      value,
    };
  } else {
    const [_, action, value] = url?.replace(baseUrl, '')?.split('/');
    return {action, value};
  }
}

export function oauthDeepLinkUrl(provider: string): string {
  return `${deepLinkingUriSchema}oauth/${provider}`;
}
