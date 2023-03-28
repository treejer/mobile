import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {isWeb} from 'utilities/helpers/web';
import {TFunction} from 'react-i18next';

export function permissionsList(plantTreePermission: TUsePlantTreePermissions, t: TFunction) {
  return [
    {
      name: t('checkPermission.permissions.location'),
      status: plantTreePermission.locationPermission
        ? plantTreePermission.isLocationGranted
          ? t('checkPermission.granted')
          : t('checkPermission.blocked')
        : t('checkPermission.checking'),
      onPress: isWeb() ? plantTreePermission.requestLocationPermission : plantTreePermission.openPermissionsSettings,
      icon: 'location-arrow',
      isExist: plantTreePermission.locationPermission,
      isGranted: plantTreePermission.isLocationGranted,
    },
    {
      name: t('checkPermission.permissions.camera'),
      status: plantTreePermission.cameraPermission
        ? plantTreePermission.isCameraGranted
          ? t('checkPermission.granted')
          : t('checkPermission.blocked')
        : t('checkPermission.checking'),
      onPress: isWeb() ? plantTreePermission.requestCameraPermission : plantTreePermission.openPermissionsSettings,
      icon: 'camera',
      isExist: plantTreePermission.cameraPermission,
      isGranted: plantTreePermission.isCameraGranted,
    },
    {
      name: t('checkPermission.permissions.GPS'),
      status: plantTreePermission.isGPSEnabled
        ? plantTreePermission.hasLocation
          ? t('checkPermission.enabled')
          : t('checkPermission.blocked')
        : t('checkPermission.checking'),
      onPress: plantTreePermission.openGpsRequest,
      icon: 'map-marker-alt',
      isExist: plantTreePermission.isGPSEnabled,
      isGranted: plantTreePermission.hasLocation,
    },
  ];
}
