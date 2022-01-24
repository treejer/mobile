import NetInfo from '@react-native-community/netinfo';

export default function useNetInfoConnected() {
  const netInfo = NetInfo.useNetInfo();

  return netInfo.isConnected && netInfo.isInternetReachable;
}
