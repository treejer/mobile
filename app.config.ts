import {ExpoConfig, ConfigContext} from '@expo/config';

const appConfig = ({config}: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Treejer Ranger',
  slug: 'treejer-ranger',
  scheme: 'com.treejer.ranger',
  icon: './assets/images/icon.png',
  splash: {
    backgroundColor: '#FAF8F0',
    image: './assets/images/splash.png',
    resizeMode: 'contain',
  },
  ios: {
    config: {
      googleMapsApiKey: process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY,
    },
  },
  android: {
    package: 'com.treejer.ranger',
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
      backgroundColor: '#FAF8F0',
    },
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

export default appConfig;
