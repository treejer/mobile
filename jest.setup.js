import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';

jest.mock('react-native-device-info', () => mockRNDeviceInfo);

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@react-navigation/stack', () => {
  return {
    createAppContainer: jest.fn().mockReturnValue(function NavigationContainer(props) {
      return null;
    }),
    createDrawerNavigator: jest.fn(),
    createMaterialTopTabNavigator: jest.fn(),
    createStackNavigator: jest.fn(),
    StackActions: {
      push: jest.fn().mockImplementation(x => ({...x, type: 'Navigation/PUSH'})),
      replace: jest.fn().mockImplementation(x => ({...x, type: 'Navigation/REPLACE'})),
    },
    NavigationActions: {
      navigate: jest.fn().mockImplementation(x => x),
    },
  };
});

jest.mock('react-native-gesture-handler', () => {});

jest.mock('react-native-permissions', () => {
  return require('react-native-permissions/mock');
});

jest.mock('react-native-geolocation-service', () => {});

jest.mock('@react-native-firebase/analytics', () => {});

jest.mock('react-native-vector-icons/FontAwesome5', () => {});
jest.mock('react-native-vector-icons/FontAwesome', () => {});
jest.mock('react-native-vector-icons/Feather', () => {});
jest.mock('react-native-vector-icons/MaterialIcons', () => {});
jest.mock('react-native-vector-icons/Octicons', () => {});
jest.mock('react-native-vector-icons/Ionicons', () => {});
jest.mock('react-native-vector-icons/AntDesign', () => {});
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {});
jest.mock('react-native-vector-icons/Entypo', () => {});

jest.mock('@magic-sdk/react-native', () => {
  return {
    Magic: jest.fn(),
  };
});
jest.mock('web3', () => {
  return function notJestFn() {
    return {
      eth: {
        Contract: jest.fn(),
      },
    };
  };
});
jest.mock('@magic-ext/react-native-oauth', () => {
  return {
    OAuthExtension: jest.fn(),
  };
});
jest.mock('@react-native-community/netinfo', () => {});
jest.mock('react-native-image-crop-picker', () => {
  return {
    Image: jest.fn(),
    Options: jest.fn(),
    openPicker: jest.fn(),
    openLibrary: jest.fn(),
  };
});

jest.mock('@rnmapbox/maps', () => {});
jest.mock('react-native-snap-carousel', () => {});
jest.mock('@react-native-clipboard/clipboard', () => {});

jest.mock('expo-barcode-scanner', () => {
  return {
    BarCodeScanner: jest.fn(),
  };
});
