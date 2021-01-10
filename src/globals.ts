/* eslint-disable @typescript-eslint/no-var-requires */
require('react-native').LogBox.ignoreLogs([
  "Warning: The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
  "Warning: The provided value 'ms-stream' is not a valid 'responseType'.",
  /No means to retreive/,
]);
require('node-libs-expo/globals');
require('get-random-values-polypony').polyfill();
