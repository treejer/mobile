module.exports = function (api) {
  console.log(process.env.REACT_APP_WEB, 'process.env.REACT_APP_WEB');
  api.cache(true);
  return {
    // eslint-disable-next-line no-process-env
    presets: [process.env.REACT_APP_WEB ? 'babel-preset-expo' : 'module:metro-react-native-babel-preset'],
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
          },
        },
      ],
      'import-graphql',
    ],
  };
};
