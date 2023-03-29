import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationContainerRef = createNavigationContainerRef();

export function navigationRef() {
  if (navigationContainerRef.isReady()) {
    return navigationContainerRef;
  }
}
