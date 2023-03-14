// @ts-ignore
import React from 'react';
import {I18nextProvider} from 'react-i18next';
import {useInitialDeepLinking} from 'utilities/hooks/useDeepLinking';
import {Provider} from 'react-redux';
import {persistor, store} from 'ranger-redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {InitNavigation} from 'navigation/InitNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MapboxGL from '@rnmapbox/maps';
import {mapboxPrivateToken} from 'services/config';
import {i18next} from './localization';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

MapboxGL.setAccessToken(mapboxPrivateToken);

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
