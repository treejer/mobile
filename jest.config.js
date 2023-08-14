module.exports = {
  preset: 'jest-expo',
  // setupFilesAfterEnv: ['@rnmapbox/maps/setup-jest'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation)',
    // 'node_modules/(?!(...|@rnmapbox))',
    // 'node_modules/?!(@react-navigation)',
    // 'node_modules/?!(react-native-gesture-handler)',
  ],
  testPathIgnorePatterns: ['node_modules/(?!(react-native|react-native-button)/)', './web-build/'],
  extensionsToTreatAsEsm: [],
  transform: {},
};
