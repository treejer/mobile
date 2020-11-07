module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            components: './src/components',
            screens: './src/screens',
            services: './src/services',
            constants: './src/constants',
            utilities: './src/utilities',
          },
        },
      ],
      'inline-dotenv',
    ],
  };
};
