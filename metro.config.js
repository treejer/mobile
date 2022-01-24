module.exports = {
  resolver: {
    extraNodeModules: require('./modules'),
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs'],
  },
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
