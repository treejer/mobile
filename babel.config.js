module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      [
        '@babel/preset-env',
        {
          targets: {node: 'current'},
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      'inline-dotenv',
      [
        'module-resolver',
        {
          extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
          alias: {
            components: './src/components',
            screens: './src/screens',
            services: './src/services',
            constants: './src/constants',
            utilities: './src/utilities',
            navigation: './src/navigation',
            types: './src/types',
            'ranger-redux': './src/redux',
            'ranger-testUtils': './src/testUtils',
          },
        },
      ],
      'import-graphql',
      'react-native-reanimated/plugin',
      ...(process.env.NODE_ENV === 'test'
        ? [
            '@babel/plugin-proposal-export-namespace-from',
            '@babel/plugin-proposal-private-methods',
            '@babel/plugin-proposal-class-properties',
          ]
        : []),
    ],
  };
};
