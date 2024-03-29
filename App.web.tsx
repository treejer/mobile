// @ts-ignore
import React, {useEffect} from 'react';
import {i18next} from './src/localization';
import {I18nextProvider} from 'react-i18next';
import {useInitialDeepLinking} from './src/utilities/hooks/useDeepLinking';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {InitNavigation} from './src/navigation/InitNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export default function App() {
  useInitialDeepLinking();

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <I18nextProvider i18n={i18next}>
          <SafeAreaProvider>
            <InitNavigation />
          </SafeAreaProvider>
        </I18nextProvider>
      </PersistGate>
    </Provider>
  );
}
