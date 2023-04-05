import React from 'react';
import {Provider} from 'react-redux';
import {I18nextProvider} from 'react-i18next';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {i18next} from './localization';
import {persistor, store} from 'ranger-redux/store';
import {InitNavigation} from 'navigation/InitNavigation';
import {useInitialDeepLinking} from 'utilities/hooks/useDeepLinking';

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
