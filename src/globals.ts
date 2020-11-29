require('react-native').LogBox.ignoreLogs([
  "Warning: The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
  "Warning: The provided value 'ms-stream' is not a valid 'responseType'.",
  /No means to retreive/,
]);
require('node-libs-expo/globals');
require('get-random-values-polypony').polyfill();

if (__DEV__) {
  global.XMLHttpRequest = global.originalXMLHttpRequest ? global.originalXMLHttpRequest : global.XMLHttpRequest;
  global.FormData = global.originalFormData ? global.originalFormData : global.FormData;

  fetch; // Ensure to get the lazy property

  if (window.__FETCH_SUPPORT__) {
    // it's RNDebugger only to have
    window.__FETCH_SUPPORT__.blob = false;
  } else {
    /*
     * Set __FETCH_SUPPORT__ to false is just work for `fetch`.
     * If you're using another way you can just use the native Blob and remove the `else` statement
     */
    global.Blob = global.originalBlob ? global.originalBlob : global.Blob;
    global.FileReader = global.originalFileReader ? global.originalFileReader : global.FileReader;
  }
}
