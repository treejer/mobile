import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {isWeb} from 'utilities/helpers/web';

export function permissionsList(plantTreePermission: TUsePlantTreePermissions) {
  return [
    {
      name: 'checkPermission.permissions.location',
      status: plantTreePermission.locationPermission
        ? plantTreePermission.isLocationGranted
          ? 'checkPermission.granted'
          : 'checkPermission.blocked'
        : 'checkPermission.dottedChecking',
      onPress: isWeb() ? plantTreePermission.requestLocationPermission : plantTreePermission.openPermissionsSettings,
      icon: 'location-arrow',
      isExist: plantTreePermission.locationPermission,
      isGranted: plantTreePermission.isLocationGranted,
    },
    {
      name: 'checkPermission.permissions.camera',
      status: plantTreePermission.cameraPermission
        ? plantTreePermission.isCameraGranted
          ? 'checkPermission.granted'
          : 'checkPermission.blocked'
        : 'checkPermission.dottedChecking',
      onPress: isWeb() ? plantTreePermission.requestCameraPermission : plantTreePermission.openPermissionsSettings,
      icon: 'camera',
      isExist: plantTreePermission.cameraPermission,
      isGranted: plantTreePermission.isCameraGranted,
    },
    {
      name: 'checkPermission.permissions.GPS',
      status: plantTreePermission.isGPSEnabled
        ? plantTreePermission.hasLocation
          ? 'checkPermission.enabled'
          : 'checkPermission.blocked'
        : 'checkPermission.dottedChecking',
      onPress: plantTreePermission.openGpsRequest,
      icon: 'map-marker-alt',
      isExist: plantTreePermission.isGPSEnabled,
      isGranted: plantTreePermission.hasLocation,
    },
  ];
}
