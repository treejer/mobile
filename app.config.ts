import {ExpoConfig, ConfigContext} from '@expo/config';

export default ({config}: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Treejer Ranger',
  slug: 'treejer-ranger',
  scheme: 'com.treejer.ranger',
  ios: {
    config: {
      googleMapsApiKey: process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY,
    },
  },
  android: {
    package: 'com.treejer.ranger',
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: true,
        data: [
          {
            scheme: 'https',
            host: 'ranger.treejer.com',
            pathPrefix: '/invite/green-block',
          },
        ],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
  },
});
