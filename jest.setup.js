import {Text, View} from 'react-native';

import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-device-info', () => mockRNDeviceInfo);
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

global.toast = {
  show: jest.fn(),
};

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// jest.mock('@react-navigation/native', () => {
//   const actualNav = jest.requireActual('@react-navigation/native');
//   return {
//     ...actualNav,
//     useNavigation: () => ({
//       navigate: jest.fn(),
//       dispatch: jest.fn(),
//     }),
//   };
// });

// jest.mock('@react-navigation/stack', () => {
//   return {
//     createAppContainer: jest.fn().mockReturnValue(function NavigationContainer(props) {
//       return null;
//     }),
//     createBottomTabNavigator: jest.fn(),
//     createDrawerNavigator: jest.fn(),
//     createMaterialTopTabNavigator: jest.fn(),
//     createStackNavigator: jest.fn(),
//     StackActions: {
//       push: jest.fn().mockImplementation(x => ({...x, type: 'Navigation/PUSH'})),
//       replace: jest.fn().mockImplementation(x => ({...x, type: 'Navigation/REPLACE'})),
//     },
//     NavigationActions: {
//       navigate: jest.fn().mockImplementation(x => x),
//     },
//   };
// });

jest.mock('@react-navigation/native/lib/commonjs/useLinking.native', () => ({
  default: () => ({getInitialState: {then: jest.fn()}}),
  __esModule: true,
}));

// jest.mock('react-native-gesture-handler', () => {});

jest.mock('react-native-permissions', () => {
  return require('react-native-permissions/mock');
});

jest.mock('react-native-geolocation-service', () => {
  return {
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
    getCurrentPosition: jest.fn(),
  };
});

jest.mock('@react-native-firebase/analytics', () => {});

const Icon = testProp => <View {...testProp} />;

jest.mock('react-native-vector-icons/FontAwesome5', () => {
  return Icon;
});
jest.mock('react-native-vector-icons/FontAwesome', () => {
  return Icon;
});
jest.mock('react-native-vector-icons/Feather', () => {
  return Icon;
});
jest.mock('react-native-vector-icons/MaterialIcons', () => {
  return Icon;
});
jest.mock('react-native-vector-icons/Octicons', () => {
  return Icon;
});
jest.mock('react-native-vector-icons/Ionicons', () => {
  return Icon;
});
jest.mock('react-native-vector-icons/AntDesign', () => {
  return Icon;
});
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  return Icon;
});
jest.mock('react-native-vector-icons/Entypo', () => {
  return Icon;
});

jest.mock('@magic-sdk/react-native-bare', () => {
  return {
    Magic: jest.fn(),
  };
});

jest.mock('@magic-ext/react-native-bare-oauth', () => {
  return {
    OAuthExtension: jest.fn(),
  };
});

jest.mock('web3', () => {
  return function notJestFn() {
    return {
      eth: {
        Contract: jest.fn(),
      },
      utils: {
        fromWei: str => str,
      },
    };
  };
});

// jest.mock('@magic-ext/react-native-oauth', () => {
//   return {
//     OAuthExtension: jest.fn(),
//   };
// });

jest.mock('@react-native-community/netinfo', () => {
  return {
    useNetInfo: () => ({
      isConnected: true,
      isInternetReachable: true,
    }),
  };
});
jest.mock('react-native-image-crop-picker', () => {
  return {
    Image: jest.fn(),
    Options: jest.fn(),
    openPicker: jest.fn(),
    openLibrary: jest.fn(),
  };
});

jest.mock('@rnmapbox/maps', () => {
  return {
    setAccessToken: jest.fn(),
    setWellKnownTileServer: jest.fn(),
    MapView: TransComponent,
    Camera: TransComponent,
    UserLocation: TransComponent,
  };
});
jest.mock('react-native-snap-carousel', () => {});
jest.mock('@react-native-clipboard/clipboard', () => {});

jest.mock('expo-barcode-scanner', () => {
  return {
    BarCodeScanner: jest.fn(),
  };
});

const TransComponent = testProp => <Text {...testProp} />;

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: str => str,
    };
  },
  Trans: TransComponent,
}));

jest.mock('i18next', () => ({
  t: str => str,
  use: jest.fn(() => {
    return {
      init: jest.fn(),
    };
  }),
}));

jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');
  return {
    ...real,
    persistReducer: jest.fn().mockImplementation((config, reducers) => reducers),
  };
});

jest.mock('./src/utilities/hooks/useTreeUpdateInterval', () => {
  return {
    useTreeUpdateInterval: () => 200,
  };
});

jest.mock('./src/utilities/helpers/IPFS', () => {
  return {
    upload: (url, uri) =>
      new Promise((resolve, reject) => {
        resolve({Hash: 'https://www.file.com'});
      }),
    getHttpDownloadUrl: () => 'https://www.file.com',
    uploadContent: () =>
      new Promise((resolve, reject) => {
        resolve({Hash: 'HASH'});
      }),
  };
});

jest.mock('./src/utilities/helpers/submitTree', () => {
  const actualImports = jest.requireActual('./src/utilities/helpers/submitTree');
  return {
    ...actualImports,
    photoToUpload: file => {
      return 'storage://file';
    },
  };
});

jest.mock('eth-sig-util', () => {
  return {
    recoverTypedSignature: (data, sig) => 'address',
  };
});

jest.mock('./src/screens/GreenBlock/screens/TreeDetails/TreePhotos', () => {
  return {
    TreePhotos: Icon,
  };
});

jest.mock('./src/utilities/helpers/photoToBase64', () => {
  return {
    photoToBase64: () => 'base 64 generated',
  };
});

jest.mock('./src/utilities/helpers/cropImage', () => {
  return () => 1;
});

jest.mock('./src/screens/TreeSubmission/screens/SelectPhoto/WebImagePickerCropper', () => {
  return () => <Icon />;
});
