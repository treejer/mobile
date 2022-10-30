module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts/'],
  dependencies: {
    'magic-sdk': {
      platforms: {
        android: null,
        ios: null,
      },
    },
    'react-easy-crop': {
      platforms: {
        android: null,
        ios: null,
      },
    },
  },
  expo: {
    autolinking: {
      exclude: ['expo-application', 'expo-asset', 'expo-constants', 'expo-file-system', 'expo-font', 'expo-keep-awake'],
    },
  },
};
