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
    bundleIdentifier: 'com.treejer.ranger',
    config: {
      googleMapsApiKey: process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY,
    },
  },
  android: {
    package: 'com.treejer.ranger',
    config: {
      googleMaps: {
        apiKey: process.env.REACT_NATIVE_GOOGLE_MAPS_ANDROID_API_KEY,
      },
    },
    adaptiveIcon: {
      foregroundImage: './assets/images/icon.png',
      backgroundColor: '#FAF8F0',
    },
    permissions: [
      'CAMERA',
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
    ],
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
