module.exports = {
  root: true,
  extends: ['@react-native-community'],
  plugins: ['unused-imports'],
  rules: {
    'no-shadow': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-console': 0,
    'unused-imports/no-unused-vars': [
      'warn',
      {vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_'},
    ],
    'react/no-unescaped-entities': 'off',
  },
  ignorePatterns: ['*.graphql.d.ts', '*.graphql', 'data'],
};
