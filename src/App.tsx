import React from 'react';
import {I18nextProvider} from 'react-i18next';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {useInitialDeepLinking} from 'utilities/hooks/useDeepLinking';
import {persistor, store} from 'ranger-redux/store';
import {InitNavigation} from 'navigation/InitNavigation';
import {i18next} from './localization';

export default function App() {
  useInitialDeepLinking();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          {/* @ts-ignore */}
          <I18nextProvider i18n={i18next}>
            <SafeAreaProvider>
              <InitNavigation />
            </SafeAreaProvider>
          </I18nextProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
