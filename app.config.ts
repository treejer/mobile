import {ExpoConfig, ConfigContext} from '@expo/config';

export default ({config}: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Treejer Ranger',
  slug: 'treejer-ranger',
  ios: {
    config: {
      googleMapsApiKey: process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY,
    },
  },
});
