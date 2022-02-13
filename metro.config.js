/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const extraNodeModules = require('node-libs-browser');

module.exports = {
  resolver: {
    extraNodeModules: {
      ...extraNodeModules,
      fs: require.resolve('react-native-fs'),
    },
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
