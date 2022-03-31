module.exports = {
  extends: [
    // 'plugin:@shopify/typescript',
    // 'plugin:@shopify/graphql',
    // 'plugin:@shopify/react',
    // 'plugin:@shopify/prettier',
    '@react-native-community',
  ],
  plugins: ['unused-imports'],
  rules: {
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-console': 0,
    'unused-imports/no-unused-vars': [
      'warn',
      {vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_'},
    ],
    'react/no-unescaped-entities': 'off',
  },
  ignorePatterns: ['*.graphql.d.ts', '*.graphql', 'data'],
};
