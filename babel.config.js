module.exports = function (api) {
  console.log(process.env.REACT_APP_WEB, 'process.env.REACT_APP_WEB');
  api.cache(true);
  return {
    // eslint-disable-next-line no-process-env
    presets: ['babel-preset-expo', ['@babel/preset-env', {targets: {node: 'current'}}], '@babel/preset-typescript'],
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
          },
        },
      ],
      'import-graphql',
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
      ['@babel/plugin-proposal-private-methods', {loose: true}],
    ],
  };
};
