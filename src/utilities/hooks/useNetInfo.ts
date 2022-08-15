import {useNetInfo} from '../../redux/modules/netInfo/netInfo';

export default function useNetInfoConnected() {
  const netInfo = useNetInfo();

  return netInfo.isConnected;
}
